import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, CreditCard, Check } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Logo from '@/assets/logos/5.svg';
import { plans } from '@/config/plans';
import { normalizeCardNumber, normalizeExpiryDate } from '@/utils/masks';

// Validation schema
const paymentSchema = z.object( {
  cardNumber: z.string()
    .min( 19, { message: "Número do cartão inválido" } )
    .max( 19, { message: "Número do cartão inválido" } )
    .regex( /^(\d{4}\s){3}\d{4}$/, { message: "Formato inválido" } )
    .transform( val => val.replace( /\s/g, '' ) ), // Remove espaços antes de enviar
  cardExpiry: z.string()
    .regex( /^(0[1-9]|1[0-2])\/([0-9]{2})$/, {
      message: "Data de expiração inválida (MM/YY)"
    } )
    .refine( ( val ) => {
      const [ month, year ] = val.split( '/' );
      const expiry = new Date( 2000 + parseInt( year ), parseInt( month ) - 1 );
      return expiry > new Date();
    }, {
      message: "Cartão expirado"
    } ),
  cardCvc: z.string()
    .length( 3, { message: "CVC inválido" } ),
  cardHolder: z.string()
    .min( 3, { message: "Nome do titular é obrigatório" } )
} );

type PaymentFormValues = z.infer<typeof paymentSchema>;

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mova a inicialização do estado para depois dos hooks de roteamento
  const [ isLoading, setIsLoading ] = useState( false );
  const [ isPageLoading, setIsPageLoading ] = useState( true );
  const [ selectedPlan, setSelectedPlan ] = useState( () => {
    const planId = location.state?.planId;
    return plans.find( p => p.id === planId ) || plans[ 0 ];
  } );

  const userData = location.state?.userData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<PaymentFormValues>( {
    resolver: zodResolver( paymentSchema ),
    mode: 'onChange'
  } );

  // Watch card number and expiry for formatting
  const cardNumber = watch( 'cardNumber' );
  const cardExpiry = watch( 'cardExpiry' );

  // Format card number as user types
  useEffect( () => {
    setValue( 'cardNumber', normalizeCardNumber( cardNumber ) );
  }, [ cardNumber, setValue ] );

  // Format expiry date as user types
  useEffect( () => {
    setValue( 'cardExpiry', normalizeExpiryDate( cardExpiry ) );
  }, [ cardExpiry, setValue ] );

  const onSubmit = async ( data: PaymentFormValues ) => {
    if ( isLoading ) return;

    setIsLoading( true );
    try {
      // Verificação mais específica
      if ( !location.state?.userData ) {
        throw new Error( 'Dados do usuário não encontrados' );
      }

      const paymentData = {
        ...data,
        planId: selectedPlan.id,
        amount: selectedPlan.price,
        userId: location.state.userData.id // Acesso mais seguro
      };

      // Simula chamada à API
      try {
        await new Promise( resolve => setTimeout( resolve, 2000 ) );

        // Após sucesso no pagamento
        toast.success( 'Pagamento realizado com sucesso!', {
          description: 'Você será redirecionado para o dashboard.'
        } );

        // Redireciona para dashboard ao invés de '/'
        navigate( '/' );
      } catch ( error ) {
        console.log( 'Erro ao processar pagamento:', error );

        throw new Error( 'Falha no processamento do pagamento' );
      }
    } catch ( error ) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error( 'Erro ao processar pagamento', {
        description: errorMessage
      } );

      // Se for erro de sessão, redireciona
      if ( errorMessage === 'Sessão expirada' ) {
        navigate( '/onboarding' );
      }
    } finally {
      setIsLoading( false );
    }
  };

  // Redirect if no user data
  useEffect( () => {
    if ( !userData ) {
      toast.error( 'Dados do usuário não encontrados' );
      navigate( '/onboarding' );
    }
  }, [ userData, navigate ] );

  useEffect( () => {
    if ( !location.state ) {
      toast.error( 'Acesso inválido' );
      navigate( '/onboarding' );
      return;
    }
  }, [ location.state, navigate ] );

  useEffect( () => {
    const checkAccess = () => {
      if ( !location.state?.userData ) {
        toast.error( 'Acesso inválido' );
        navigate( '/onboarding' );
        return false;
      }
      return true;
    };

    if ( checkAccess() ) {
      // Simula carregamento inicial somente se tiver acesso válido
      setTimeout( () => setIsPageLoading( false ), 500 );
    }
  }, [ location.state, navigate ] );

  const handlePlanChange = ( value: string ) => {
    if ( isLoading ) return;

    const newPlan = plans.find( p => p.id === value ) || plans[ 0 ];
    if ( selectedPlan.price !== newPlan.price ) {
      toast.info(
        `Alterando para plano ${newPlan.name}`,
        {
          description: `Novo valor: ${new Intl.NumberFormat( 'pt-BR', {
            style: 'currency',
            currency: 'BRL'
          } ).format( newPlan.price )}/mês`
        }
      );
      setSelectedPlan( newPlan );
    }
  };

  useEffect( () => {
    console.log( 'Location State:', location.state );
    console.log( 'User Data:', userData );
  }, [ location.state, userData ] );

  if ( isPageLoading ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-50 p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-t from-blue-900 via-blue-600 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow animation-delay-2000"></div>

      {/* Logo */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
        <img src={Logo} alt="Barberflow" className="h-8 md:h-10 w-auto" />
      </div>

      {/* Features Section */}
      <div className="hidden lg:block w-full max-w-md p-8">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Bem-vindo(a), {userData?.firstName}!
            </h2>
            <p className="text-gray-600">
              Escolha seu plano e complete o pagamento.
            </p>
          </div>

          {/* Plan Selection */}
          <div className="space-y-4">
            <RadioGroup
              defaultValue={selectedPlan.id}
              value={selectedPlan.id} // Adiciona controle do valor
              onValueChange={handlePlanChange}
              className="grid gap-4"
              disabled={isLoading}
            >
              {plans.map( ( plan ) => (
                <div
                  key={plan.id}
                  className={`relative flex items-center space-x-2 rounded-lg border p-4 shadow-sm transition-colors 
                    ${selectedPlan.id === plan.id ? 'border-primary bg-primary/5' : 'border-muted'}`}
                >
                  <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
                  <div className="flex-1">
                    <label
                      htmlFor={plan.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {plan.name}
                    </label>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    <p className="mt-1.5 text-lg font-semibold text-primary">
                      {new Intl.NumberFormat( 'pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      } ).format( plan.price )}/mês
                    </p>
                    <ul className="mt-2 text-sm text-muted-foreground">
                      {plan.features.map( ( feature, i ) => (
                        <li key={i} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ) )}
                    </ul>
                  </div>
                </div>
              ) )}
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Payment Card */}
      <Card className="w-full max-w-md shadow-xl z-10 bg-white/80 backdrop-blur-md lg:ml-8">
        <CardHeader>
          <CardTitle>Informações de Pagamento</CardTitle>
          <CardDescription>
            Total a pagar: {new Intl.NumberFormat( 'pt-BR', {
              style: 'currency',
              currency: 'BRL'
            } ).format( selectedPlan.price )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-base">{selectedPlan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedPlan.description}
                </p>
                <ul className="mt-2 space-y-1">
                  {selectedPlan.features.map( ( feature, i ) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center">
                      <Check className="mr-1 h-3 w-3 text-primary" />
                      {feature}
                    </li>
                  ) )}
                </ul>
              </div>
              <p className="text-lg font-semibold text-primary">
                {new Intl.NumberFormat( 'pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                } ).format( selectedPlan.price )}/mês
              </p>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Alterar plano
                </p>
                <Select
                  value={selectedPlan.id}
                  onValueChange={handlePlanChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map( ( plan ) => (
                      <SelectItem
                        key={plan.id}
                        value={plan.id}
                        className="flex items-center justify-between"
                      >
                        <span>{plan.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {new Intl.NumberFormat( 'pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          } ).format( plan.price )}/mês
                        </span>
                      </SelectItem>
                    ) )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit( onSubmit )} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  {...register( 'cardNumber' )}
                  maxLength={19}
                  className="font-mono tracking-wider"
                  autoComplete="cc-number"
                  inputMode="numeric"
                  disabled={isLoading}
                  onKeyPress={( e ) => {
                    if ( !/[0-9\s]/.test( e.key ) ) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.cardNumber && (
                  <p className="text-xs text-red-600">{errors.cardNumber.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Validade</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/YY"
                    {...register( 'cardExpiry' )}
                    maxLength={5}
                    autoComplete="cc-exp"
                    inputMode="numeric"
                    disabled={isLoading}
                  />
                  {errors.cardExpiry && (
                    <p className="text-xs text-red-600">{errors.cardExpiry.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input
                    id="cardCvc"
                    placeholder="123"
                    {...register( 'cardCvc' )}
                    maxLength={3}
                    type="password"
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    disabled={isLoading}
                  />
                  {errors.cardCvc && (
                    <p className="text-xs text-red-600">{errors.cardCvc.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardHolder">Nome no Cartão</Label>
                <Input
                  id="cardHolder"
                  placeholder="Nome como aparece no cartão"
                  {...register( 'cardHolder' )}
                  autoComplete="cc-name"
                  disabled={isLoading}
                />
                {errors.cardHolder && (
                  <p className="text-xs text-red-600">{errors.cardHolder.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {`Pagar ${new Intl.NumberFormat( 'pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  } ).format( selectedPlan.price )}`}
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground flex items-center">
            <CreditCard className="w-4 h-4 mr-2" />
            Pagamento seguro via Stripe
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PaymentPage;