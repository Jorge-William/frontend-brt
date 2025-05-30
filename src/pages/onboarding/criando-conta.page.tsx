// Possível caminho: src/pages/OnboardingPage.tsx ou src/features/auth/OnboardingPage.tsx
import {
  Link,
  useNavigate,
  // useNavigate
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Eye, EyeOff } from 'lucide-react'; // Replace Icons import with these
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
import Logo from '@/assets/logos/5.svg';
import { UsersService } from '@/services/users/users-service';
import { normalizePhoneNumber } from '@/utils/masks';

// Esquema de validação com Zod
const onboardingSchema = z.object( {
  fullName: z.string().min( 3, { message: "Nome completo deve ter pelo menos 3 caracteres." } ),
  email: z.string().email( { message: "Por favor, insira um email válido." } ),
  phone: z.string()
    .min( 14, { message: "Telefone é obrigatório" } )
    .regex( /^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/, {
      message: "Telefone inválido"
    } ),
  password: z.string().min( 8, { message: "Senha deve ter pelo menos 8 caracteres." } )
  // Você pode adicionar mais validações para a senha aqui, como regex para caracteres especiais, etc.
  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
  //   message: "Senha deve conter maiúscula, minúscula, número e símbolo."
  // })
} );

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function CriarContaPage() {
  const [ isLoading, setIsLoading ] = useState( false );
  const [ showPassword, setShowPassword ] = useState( false );
  // const navigate = useNavigate(); // Para redirecionamento após o cadastro

  const {
    register,
    handleSubmit,
    watch, // Para observar o valor da senha para o medidor de força
    setValue,
    formState: { errors },
  } = useForm<OnboardingFormValues>( {
    resolver: zodResolver( onboardingSchema ),
    mode: "onChange", // Valida ao mudar o campo, útil para o medidor de força
  } );

  const passwordValue = watch( "password", "" ); // Observa o campo da senha
  const phoneValue = watch( "phone" );

  useEffect( () => {
    setValue( "phone", normalizePhoneNumber( phoneValue ) );
  }, [ phoneValue, setValue ] );

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<OnboardingFormValues> = async ( data ) => {
    setIsLoading( true );

    try {
      const result = await UsersService.create( {
        email: data.email,
        firstName: data.fullName.split( ' ' )[ 0 ],
        lastName: data.fullName.split( ' ' ).slice( 1 ).join( ' ' ),
        password: data.password,
        cellphone: data.phone.replace( /\D/g, '' ) // Remove all non-digits
      } );

      if ( result instanceof Error ) {
        console.error( result.message );
      } else {
        console.log( 'Usuário criado com sucesso!' );
        navigate( '/verificar-codigo', {
          state: { email: data.email }
        } );
      }
    } catch ( error ) {
      console.error( 'Erro ao criar conta:', error );
    } finally {
      setIsLoading( false );
    }
  };

  // Função simples para avaliar a força da senha (exemplo básico)
  const getPasswordStrength = ( pass: string = "" ): number => {
    if ( !pass ) return 0;
    let strength = 0;
    if ( pass.length >= 8 ) strength += 1;
    if ( pass.match( /[a-z]/ ) && pass.match( /[A-Z]/ ) ) strength += 1;
    if ( pass.match( /\d/ ) ) strength += 1;
    if ( pass.match( /[^a-zA-Z\d]/ ) ) strength += 1; // Caracteres especiais
    return strength; // Retorna um valor de 0 a 4
  };

  const passwordStrength = getPasswordStrength( passwordValue );

  const getStrengthColor = ( level: number ): string => {
    if ( passwordValue.length > 0 ) {
      if ( level === 0 ) return 'bg-gray-300'; // Muito fraca (quando algo foi digitado mas não atinge o nível 1)
      if ( level === 1 ) return 'bg-red-600'; // Muito fraca
      if ( level === 2 ) return 'bg-orange-500'; // Fraca
      if ( level === 3 ) return 'bg-yellow-500'; // Média
      if ( level === 4 ) return 'bg-green-500'; // Forte
    }
    return 'bg-gray-200'; // Cor padrão ou quando vazio
  };


  return (

    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-50 p-4 relative overflow-hidden">

      {/* Background elements - Updated with blue gradients */}
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-t from-blue-900 via-blue-600 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow animation-delay-2000"></div>

      {/* Logo */}
      <div className="absolute left-6 md:top-8 md:left-8 z-10 max-w-md hidden lg:block w-full">
        <img src={Logo} alt="Barberflow" className="h-8 md:h-15 w-auto" />
      </div>

      {/* Features Section - Visible only on desktop */}
      <div className="hidden lg:block w-full max-w-md p-8">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Gerencie sua barbearia</h2>
            <p className="text-gray-600">Controle agendamentos, clientes e serviços em uma única plataforma.</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Aumente sua eficiência</h2>
            <p className="text-gray-600">Automatize processos e reduza faltas com lembretes automáticos.</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Fidelize seus clientes</h2>
            <p className="text-gray-600">Ofereça uma experiência moderna de agendamento online 24/7.</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="w-full max-w-md shadow-xl z-10 bg-white/80 backdrop-blur-md lg:ml-8">
        <CardHeader className="text-center space-y-1">

          <CardTitle className="text-2xl">
            Crie sua conta no Barberflow
          </CardTitle>
          <CardDescription>
            É rápido e fácil. Comece a gerenciar seus agendamentos hoje mesmo!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit( onSubmit )}> {/* Usa o handleSubmit do react-hook-form */}
            <div className="grid w-full items-center gap-4"> {/* Reduzido o gap para melhor densidade */}
              {/* Campo Nome Completo */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  placeholder="Seu nome completo"
                  {...register( "fullName" )}
                  disabled={isLoading}
                  aria-invalid={errors.fullName ? "true" : "false"}
                />
                {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
              </div>

              {/* Campo Email */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  {...register( "email" )}
                  disabled={isLoading}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>

              {/* Campo Telefone */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  {...register( "phone" )}
                  disabled={isLoading}
                  aria-invalid={errors.phone ? "true" : "false"}
                  maxLength={15}
                />
                {errors.phone && (
                  <p className="text-xs text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Campo Senha */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Senha</Label>
                  <span className="text-xs text-muted-foreground">
                    {passwordValue.length > 0 && passwordStrength <= 1 && "Muito Fraca"}
                    {passwordValue.length > 0 && passwordStrength === 2 && "Média"}
                    {passwordValue.length > 0 && passwordStrength === 3 && "Forte"}
                    {passwordValue.length > 0 && passwordStrength === 4 && "Muito Forte"}
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crie uma senha segura"
                    {...register( "password" )}
                    disabled={isLoading}
                    className="pr-10"
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-600"
                    onClick={() => setShowPassword( !showPassword )}
                    disabled={isLoading}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {/* Indicador de força da senha visual */}
                <div className="flex space-x-1 h-1.5 mt-1">
                  <div className={`flex-1 rounded-full transition-colors duration-300 ${passwordStrength >= 1 ? getStrengthColor( 1 ) : 'bg-gray-200'}`}></div>
                  <div className={`flex-1 rounded-full transition-colors duration-300 ${passwordStrength >= 2 ? getStrengthColor( 2 ) : 'bg-gray-200'}`}></div>
                  <div className={`flex-1 rounded-full transition-colors duration-300 ${passwordStrength >= 3 ? getStrengthColor( 3 ) : 'bg-gray-200'}`}></div>
                  <div className={`flex-1 rounded-full transition-colors duration-300 ${passwordStrength >= 4 ? getStrengthColor( 4 ) : 'bg-gray-200'}`}></div>
                </div>
                {errors.password ? (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    Use 8+ caracteres com maiúsculas, minúsculas, números e símbolos.
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cadastrar
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pt-4">
          <p className="text-sm text-center text-muted-foreground">
            Já possui cadastro?{' '}
            <Button variant="link" asChild className="p-0 h-auto font-medium text-primary hover:underline">
              <Link to="/login"> {/* Link do react-router-dom */}
                Fazer login
              </Link>
            </Button>
          </p>
        </CardFooter>
      </Card>

    </div>
  );
}
