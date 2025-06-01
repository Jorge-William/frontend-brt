import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  Users,
  TrendingUp,
  Building,
  User,
  Phone,
  MapPin,
  Mail,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Logo from '@/assets/logos/5.svg'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { normalizePhoneNumber } from '@/utils/masks'
import cep from 'cep-promise'

// Schema de validação
const barbeariaSchema = z.object( {
  nomeBarbearia: z.string().min( 3, { message: "Nome da barbearia deve ter pelo menos 3 caracteres." } ),
  nomeResponsavel: z.string().min( 3, { message: "Nome do responsável deve ter pelo menos 3 caracteres." } ),
  telefone: z.string()
    .min( 14, { message: "Telefone é obrigatório" } )
    .regex( /^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/, {
      message: "Telefone inválido"
    } ),
  endereco: z.string().min( 5, { message: "Endereço é obrigatório" } ),
  email: z.string().email( { message: "Email inválido" } ),
  horarioFuncionamento: z.string().min( 3, { message: "Horário de funcionamento é obrigatório" } ),
  especialidades: z.array( z.string() ).min( 1, { message: "Selecione pelo menos uma especialidade" } ),
  logo: z.any().optional(),
  fotoEspaco: z.any().optional(),
  comoConheceu: z.string().optional(),
  expectativas: z.string().optional(),
  logradouro: z.string().min( 5, { message: "Logradouro é obrigatório" } ),
  numero: z.string().min( 1, { message: "Número é obrigatório" } ),
  complemento: z.string().optional(),
  bairro: z.string().min( 3, { message: "Bairro é obrigatório" } ),
  estado: z.string().length( 2, { message: "Estado inválido" } ),
} );

type BarbeariaFormValues = z.infer<typeof barbeariaSchema>;

type Step = {
  id: number
  title: string
  description: string
}

export default function ConfigBarbearia() {
  const navigate = useNavigate()
  const [ isLoading, setIsLoading ] = useState( false )
  const [ currentStep, setCurrentStep ] = useState( 0 )
  const [ isCepLoading, setIsCepLoading ] = useState( false )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BarbeariaFormValues>( {
    resolver: zodResolver( barbeariaSchema ),
    mode: "onChange",
  } );

  // Watch phone value for formatting
  const phoneValue = watch( "telefone" );

  useEffect( () => {
    if ( phoneValue ) {
      setValue( "telefone", normalizePhoneNumber( phoneValue ) );
    }
  }, [ phoneValue, setValue ] );

  const onSubmit = async ( data: BarbeariaFormValues ) => {
    setIsLoading( true );

    try {
      // Simular envio
      await new Promise( resolve => setTimeout( resolve, 2000 ) );

      // Navegar para próxima etapa
      navigate( '/payment', {
        state: {
          barbeariaData: data
        }
      } );
    } catch ( error ) {
      console.error( 'Erro ao configurar barbearia:', error );
    } finally {
      setIsLoading( false );
    }
  };

  const handleCepSearch = async ( cepValue: string ) => {
    if ( cepValue.length === 8 ) {
      try {
        setIsCepLoading( true )
        const result = await cep( cepValue )

        // Update form fields with CEP data
        setValue( "logradouro", result.street )
        setValue( "bairro", result.neighborhood )
        setValue( "estado", result.state )
        // Reset número and complemento
        setValue( "numero", "" )
        setValue( "complemento", "" )

      } catch ( error ) {
        console.error( 'Erro ao buscar CEP:', error )
      } finally {
        setIsCepLoading( false )
      }
    }
  }

  const steps: Step[] = [
    {
      id: 1,
      title: "Boas-vindas",
      description: "Conheça o BaberFlow"
    },
    {
      id: 2,
      title: "Dados básicos",
      description: "Informações da barbearia"
    },
    {
      id: 3,
      title: "Contato",
      description: "Meios de comunicação"
    },
    {
      id: 4,
      title: "Finalização",
      description: "Últimos detalhes"
    }
  ]

  const renderStepContent = () => {
    switch ( currentStep ) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold mb-2">Bem-vindo ao BaberFlow!</h1>
              <p className="text-muted-foreground text-lg">
                O futuro da sua barbearia começa aqui.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Calendar className="w-12 h-12 mb-4 text-primary" />
                  <p className="text-center">Gerencie seus horários com facilidade</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Users className="w-12 h-12 mb-4 text-primary" />
                  <p className="text-center">Aproxime-se dos seus clientes</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <TrendingUp className="w-12 h-12 mb-4 text-primary" />
                  <p className="text-center">Cresça seu negócio com inteligência</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Dados básicos</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                {/* Nome da Barbearia */}
                <div className="space-y-2">
                  <Label htmlFor="nomeBarbearia">Nome da Barbearia</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nomeBarbearia"
                      {...register( "nomeBarbearia" )}
                      placeholder="Digite o nome da barbearia"
                      className="pl-10"
                    />
                  </div>
                  {errors.nomeBarbearia && (
                    <p className="text-xs text-red-600">{errors.nomeBarbearia.message}</p>
                  )}
                </div>

                {/* Nome do Responsável */}
                <div className="space-y-2">
                  <Label htmlFor="nomeResponsavel">Nome do Responsável</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nomeResponsavel"
                      {...register( "nomeResponsavel" )}
                      placeholder="Digite o nome do responsável"
                      className="pl-10"
                    />
                  </div>
                  {errors.nomeResponsavel && (
                    <p className="text-xs text-red-600">{errors.nomeResponsavel.message}</p>
                  )}
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telefone"
                      {...register( "telefone" )}
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                      maxLength={15}
                    />
                  </div>
                  {errors.telefone && (
                    <p className="text-xs text-red-600">{errors.telefone.message}</p>
                  )}
                </div>

                {/* Endereço - Grid para campos de endereço */}
                <div className="space-y-4">
                  <Label>Endereço</Label>
                  <div className="grid grid-cols-1 gap-4">
                    {/* CEP */}
                    <div className="w-[180px]">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="CEP"
                          className={`pl-10 ${isCepLoading ? 'pr-10' : ''}`}
                          maxLength={8}
                          onChange={( e ) => {
                            const value = e.target.value.replace( /\D/g, '' )
                            if ( value.length === 8 ) {
                              handleCepSearch( value )
                            }
                          }}
                        />
                        {isCepLoading && (
                          <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />
                        )}
                      </div>
                    </div>

                    {/* Logradouro e Número */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...register( "logradouro" )}
                            placeholder="Logradouro"
                            className="pl-10"
                          />
                        </div>
                        {errors.logradouro && (
                          <p className="text-xs text-red-600">{errors.logradouro.message}</p>
                        )}
                      </div>

                      <div className="col-span-1">
                        <Input
                          {...register( "numero" )}
                          placeholder="Nº"
                          className="w-full"
                        />
                        {errors.numero && (
                          <p className="text-xs text-red-600">{errors.numero.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Complemento */}
                    <div>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...register( "complemento" )}
                          placeholder="Complemento (opcional)"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Bairro e UF */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...register( "bairro" )}
                            placeholder="Bairro"
                            className="pl-10"
                          />
                        </div>
                        {errors.bairro && (
                          <p className="text-xs text-red-600">{errors.bairro.message}</p>
                        )}
                      </div>

                      <div>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...register( "estado" )}
                            placeholder="UF"
                            className="pl-10"
                            maxLength={2}
                            style={{ textTransform: 'uppercase' }}
                          />
                        </div>
                        {errors.estado && (
                          <p className="text-xs text-red-600">{errors.estado.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Informações de contato</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      {...register( "email" )}
                      type="email"
                      placeholder="exemplo@email.com"
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horarioFuncionamento">Horário de Funcionamento</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="horarioFuncionamento"
                      {...register( "horarioFuncionamento" )}
                      placeholder="Ex: 09:00 às 19:00"
                      className="pl-10"
                    />
                  </div>
                  {errors.horarioFuncionamento && (
                    <p className="text-xs text-red-600">{errors.horarioFuncionamento.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Finalização</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comoConheceu">Como conheceu o BaberFlow?</Label>
                  <Select
                    onValueChange={( value ) => setValue( "comoConheceu", value )}
                    defaultValue={watch( "comoConheceu" )}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="redes-sociais">Redes Sociais</SelectItem>
                      <SelectItem value="indicacao">Indicação</SelectItem>
                      <SelectItem value="pesquisa">Pesquisa na Internet</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectativas">O que espera do nosso app?</Label>
                  <Textarea
                    id="expectativas"
                    {...register( "expectativas" )}
                    placeholder="Conte-nos suas expectativas..."
                  />
                  {errors.expectativas && (
                    <p className="text-xs text-red-600">{errors.expectativas.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900 rounded-full opacity-20 blur-3xl animate-pulse-slow" />
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-t from-blue-900 via-blue-600 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow animation-delay-2000" />

      {/* Logo - Fixed position and responsive alignment */}
      <div className="absolute top-6 md:top-8 left-1/2 md:left-8 transform md:transform-none -translate-x-1/2 md:translate-x-0 z-10">
        <img src={Logo} alt="Barberflow" className="h-8 md:h-10 w-auto" />
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-3xl shadow-xl z-10 bg-white/80 backdrop-blur-md mt-16 md:mt-0">
        <form onSubmit={handleSubmit( onSubmit )}>
          <div className="p-6">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                {steps.map( ( step, index ) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${index <= currentStep ? "text-primary" : "text-muted-foreground"
                      }`}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center mb-2
                      ${index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted"}
                    `}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">{step.title}</span>
                    <span className="text-xs">{step.description}</span>
                  </div>
                ) )}
              </div>
              <Progress
                value={( currentStep + 1 ) * ( 100 / steps.length )}
                className="h-2"
              />
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep( prev => prev - 1 )}
                disabled={currentStep === 0 || isLoading}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>

              <Button
                type={currentStep === steps.length - 1 ? "submit" : "button"}
                onClick={currentStep === steps.length - 1 ? undefined : () => setCurrentStep( prev => prev + 1 )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {currentStep === steps.length - 1 ? "Concluir" : "Próximo"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}