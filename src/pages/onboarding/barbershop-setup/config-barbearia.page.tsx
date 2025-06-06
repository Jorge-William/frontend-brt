import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  Phone,
  MapPin,
  Mail,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/assets/logos/5.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { normalizePhoneNumber, normalizeCep } from "@/utils/masks";
import cep from "cep-promise";
import { toast } from "sonner";
import { observer } from "mobx-react-lite";
import { autorun } from "mobx";
import OnboardingStore from "@/stores/OnboardingStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import confetti from 'canvas-confetti';
import { BarbershopService } from "@/services/barbershop/barbershop-service";

// Schema de validação
const barbeariaSchema = z.object( {
  nomeBarbearia: z
    .string()
    .min( 3, { message: "Nome da barbearia deve ter pelo menos 3 caracteres." } ),
  nomeResponsavel: z.string().min( 3, {
    message: "Nome do responsável deve ter pelo menos 3 caracteres.",
  } ),
  telefoneResponsavel: z
    .string()
    .min( 14, { message: "Telefone do responsável é obrigatório" } )
    .regex( /^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/, {
      message: "Telefone do responsável inválido",
    } ),
  mesFundacao: z.string().min( 1, { message: "Mês de fundação é obrigatório" } ),
  anoFundacao: z
    .string()
    .min( 4, { message: "Ano inválido" } )
    .max( 4, { message: "Ano inválido" } )
    .refine(
      ( val ) => {
        const year = parseInt( val );
        return year >= 1900 && year <= new Date().getFullYear();
      },
      { message: "Ano inválido" },
    ),
  telefoneBarbearia: z
    .string()
    .min( 14, { message: "Telefone é obrigatório" } )
    .regex( /^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/, {
      message: "Telefone inválido",
    } ),
  endereco: z.string().min( 5, { message: "Endereço é obrigatório" } ),
  email: z.string().email( { message: "Email inválido" } ),
  horarioAbertura: z
    .string()
    .min( 1, { message: "Horário de abertura é obrigatório" } ),
  horarioFechamento: z
    .string()
    .min( 1, { message: "Horário de fechamento é obrigatório" } ),
  especialidades: z
    .array( z.string() )
    .min( 1, { message: "Selecione pelo menos uma especialidade" } ),
  logo: z.any().optional(),
  fotoEspaco: z.any().optional(),
  comoConheceu: z.string().optional(),
  expectativas: z.string().optional(),
  logradouro: z.string().min( 5, { message: "Logradouro é obrigatório" } ),
  numero: z.string().min( 1, { message: "Número é obrigatório" } ),
  complemento: z.string().optional(),
  bairro: z.string().min( 3, { message: "Bairro é obrigatório" } ),
  estado: z.string().length( 2, { message: "Estado inválido" } ),
  cep: z
    .string()
    .min( 1, { message: "CEP é obrigatório" } )
    .regex( /^\d{5}-\d{3}$/, { message: "Formato de CEP inválido" } )
    .transform( ( value ) => value.replace( /\D/g, "" ) ),
} );

type BarbeariaFormValues = z.infer<typeof barbeariaSchema>;

type Step = {
  id: number;
  title: string;
  description: string;
};

const ConfigBarbearia = observer( () => {
  const userStore = OnboardingStore;
  const navigate = useNavigate();
  const [ isLoading, setIsLoading ] = useState( false );
  const [ currentStep, setCurrentStep ] = useState( 0 );
  const [ isCepLoading, setIsCepLoading ] = useState( false );
  const [ showAddressFields, setShowAddressFields ] = useState( false );
  const [ mesmoTelefone, setMesmoTelefone ] = useState( false );
  const [ mesmoEmail, setMesmoEmail ] = useState( false ); // Novo estado para o e-mail

  useEffect( () => {
    // Trigger confetti when component mounts
    if ( OnboardingStore.userData.email ) {
      triggerConfetti();
    } else {
      // If no email is set, navigate to the previous step
      navigate( "/onboarding/novo-usuario" );
    }
  }, [ navigate ] );


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
  const cepValue = watch( "cep" );

  // Update watch statements
  const telefoneBarbeariaValue = watch( "telefoneBarbearia" );

  useEffect( () => {
    if ( cepValue ) {
      setValue( "cep", normalizeCep( cepValue ) );
    }
  }, [ cepValue, setValue ] );

  // Update useEffect
  useEffect( () => {
    if ( OnboardingStore.userData.cellphone ) {
      const phoneFormatted = normalizePhoneNumber( OnboardingStore.userData.cellphone );
      setValue( "telefoneResponsavel", phoneFormatted );

      if ( mesmoTelefone ) {
        setValue( "telefoneBarbearia", phoneFormatted );
        updateBarbershopStore( "phone", phoneFormatted );
      }
    }
  }, [ setValue, mesmoTelefone ] );

  useEffect( () => {
    if ( telefoneBarbeariaValue && !mesmoTelefone ) {
      setValue(
        "telefoneBarbearia",
        normalizePhoneNumber( telefoneBarbeariaValue ),
      );
    }
  }, [ telefoneBarbeariaValue, setValue, mesmoTelefone ] );

  const onSubmit = async ( data: BarbeariaFormValues ) => {
    setIsLoading( true );

    try {
      const barbershopData = {
        name: data.nomeBarbearia,
        owner: data.nomeResponsavel,
        phone: normalizePhoneNumber( data.telefoneBarbearia ),
        foundationDate: {
          month: data.mesFundacao,
          year: data.anoFundacao,
        },
        email: data.email,
        address: {
          zipCode: data.cep,
          street: data.logradouro,
          number: data.numero,
          complement: data.complemento || "",
          neighborhood: data.bairro,
          state: data.estado,
        },
        businessHours: {
          opening: data.horarioAbertura,
          closing: data.horarioFechamento,
        }
      };

      // Update store with complete data
      OnboardingStore.setBarbershopData( barbershopData );

      // Simular envio
      await new Promise( ( resolve ) => setTimeout( resolve, 2000 ) );

      // Navigate without passing state
      navigate( "/onboarding/payment" );
    } catch ( error ) {
      console.error( "Erro ao configurar barbearia:", error );
    } finally {
      setIsLoading( false );
    }
  };

  const handleCepSearch = async ( cepValue: string ) => {
    if ( cepValue.length === 8 ) {
      try {
        setIsCepLoading( true );
        setShowAddressFields( false );
        const result = await cep( cepValue );

        const addressData = {
          zipCode: normalizeCep( cepValue ),
          street: result.street,
          neighborhood: result.neighborhood,
          state: result.state,
        };

        // Update form
        setValue( "logradouro", result.street );
        setValue( "bairro", result.neighborhood );
        setValue( "estado", result.state );
        setValue( "cep", normalizeCep( cepValue ) );

        // Update store
        updateBarbershopStore( "address", {
          ...OnboardingStore.barbershopData.address,
          ...addressData
        } );

        // Show success toast
        toast.success( "CEP encontrado", {
          description: "Endereço preenchido automaticamente",
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        } );

        setShowAddressFields( true );
      } catch ( error ) {
        console.error( "Erro ao buscar CEP:", error );

        // Enhanced error handling with Sonner
        if ( !navigator.onLine ) {
          toast.error( "Erro de conexão", {
            description:
              "Verifique sua conexão com a internet e tente novamente",
            icon: <AlertCircle className="h-4 w-4 text-red-500" />,
            action: {
              label: "Tentar novamente",
              onClick: () => handleCepSearch( cepValue ),
            },
          } );
        } else if ( error instanceof Error ) {
          toast.warning( "CEP não encontrado", {
            description: "Verifique se o CEP informado está correto",
            icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
            action: {
              label: "Consultar Correios",
              onClick: () =>
                window.open(
                  `https://buscacepinter.correios.com.br/app/endereco/index.php?t`,
                  "_blank",
                ),
            },
          } );
        } else {
          toast.error( "Erro ao buscar endereço", {
            description:
              "Ocorreu um erro inesperado. Tente novamente mais tarde.",
            icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          } );
        }

        setShowAddressFields( false );
      } finally {
        setIsCepLoading( false );
      }
    }
  };

  const steps: Step[] = [
    {
      id: 1,
      title: "Boas-vindas",
      description: "Conheça o BaberFlow",
    },
    {
      id: 2,
      title: "Dados básicos",
      description: "Informações da barbearia",
    },
    {
      id: 3,
      title: "Contato",
      description: "Meios de comunicação",
    },
    {
      id: 4,
      title: "Finalização",
      description: "Últimos detalhes",
    },
  ];

  const renderStepContent = () => {
    switch ( currentStep ) {
      case 0:
        return (
          <div className="space-y-6"> {/* Changed from space-y-8 to space-y-6 */}
            <div className="text-center space-y-2"> {/* Reduced space-y-4 to space-y-2 */}
              <h1 className="text-3xl font-bold"> {/* Changed from text-4xl and removed mb-2 */}
                Bem-vindo ao BaberFlow!
              </h1>
              <p className="text-slate-600 text-lg">
                O futuro da sua barbearia começa aqui.
              </p>
            </div>

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-lg mx-auto h-[450px]" // Added fixed height
            >
              <CarouselContent>
                <CarouselItem>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center p-4"> {/* Reduced padding from p-6 */}
                        <div className="w-full max-w-[240px]"> {/* Reduced from 500px */}
                          <AspectRatio ratio={3 / 4} className="bg-muted">
                            <img
                              src="/src/assets/slide-onboading/papelada.jpg"
                              alt="Agenda"
                              className="rounded-md object-cover w-full h-full"
                              loading="lazy"
                            />
                          </AspectRatio>
                        </div>
                        <p className="text-slate-600 text-center mt-2 text-sm"> {/* Reduced margin and font size */}
                          Saia do século passado! Organize seus horários e clientes sem stress com BarberFlow.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center p-4">
                        <div className="w-full max-w-[240px]">
                          <AspectRatio ratio={3 / 4} className="bg-muted">
                            <img
                              src="/src/assets/slide-onboading/gerencie-com-smartphone.jpg"
                              alt="Agenda"
                              className="rounded-md object-cover w-full h-full"
                              loading="lazy"
                            />
                          </AspectRatio>
                        </div>
                        <p className="text-slate-600 text-center mt-2 text-sm">
                          Gerencie seus horários com facilidade
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>

                <CarouselItem>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center p-4">
                        <div className="w-full max-w-[240px]">
                          <AspectRatio ratio={3 / 4} className="bg-muted">
                            <img
                              src="/src/assets/slide-onboading/cliente-feliz.jpg"
                              alt="Clientes"
                              className="rounded-md object-cover w-full h-full"
                              loading="lazy"
                            />
                          </AspectRatio>
                        </div>
                        <p className="text-slate-600 text-center mt-2 text-sm">
                          Aproxime-se dos seus clientes
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>

                <CarouselItem>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center p-4">
                        <div className="w-full max-w-[240px]">
                          <AspectRatio ratio={3 / 4} className="bg-muted">
                            <img
                              src="/src/assets/slide-onboading/crescer.jpg"
                              alt="Analytics"
                              className="rounded-md object-cover w-full h-full"
                              loading="lazy"
                            />
                          </AspectRatio>
                        </div>
                        <p className="text-slate-600 text-center mt-2 text-sm">
                          Cresça seu negócio com inteligência
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Dados básicos</h2>
            <div className="space-y-6">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-12 gap-4 items-start">
                {/* Nome da Barbearia - 8 columns */}
                <div className="col-span-12 md:col-span-8 space-y-2">
                  <Label htmlFor="nomeBarbearia">Nome do Estabelecimento</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nomeBarbearia"
                      {...register( "nomeBarbearia" )}
                      placeholder="Digite o nome da barbearia"
                      className="pl-10 w-full"
                      onChange={( e ) => {
                        const value = e.target.value;
                        setValue( "nomeBarbearia", value );
                        updateBarbershopStore( "name", value );
                      }}
                    />
                  </div>
                  {errors.nomeBarbearia && (
                    <p className="text-xs text-red-600">
                      {errors.nomeBarbearia.message}
                    </p>
                  )}
                </div>

                {/* Data de Fundação - 4 columns */}
                <div className="col-span-12 md:col-span-4 space-y-2">
                  <Label>Data de Fundação</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Mês */}
                    <Select
                      onValueChange={( value ) => {
                        setValue( "mesFundacao", value );
                        updateBarbershopStore( "foundationDate", {
                          ...OnboardingStore.barbershopData.foundationDate,
                          month: value
                        } );
                      }}
                      value={watch( "mesFundacao" )}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Janeiro", "Fevereiro", "Março", "Abril",
                          "Maio", "Junho", "Julho", "Agosto",
                          "Setembro", "Outubro", "Novembro", "Dezembro",
                        ].map( ( month, index ) => (
                          <SelectItem
                            key={index}
                            value={( index + 1 ).toString().padStart( 2, '0' )}
                          >
                            {month}
                          </SelectItem>
                        ) )}
                      </SelectContent>
                    </Select>

                    {/* Ano */}
                    <Select
                      onValueChange={( value ) => {
                        setValue( "anoFundacao", value );
                        updateBarbershopStore( "foundationDate", {
                          ...OnboardingStore.barbershopData.foundationDate,
                          year: value
                        } );
                      }}
                      value={watch( "anoFundacao" )}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ano" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from( { length: 40 }, ( _, i ) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <SelectItem
                              key={year}
                              value={year.toString()}
                            >
                              {year}
                            </SelectItem>
                          );
                        } )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {( errors.mesFundacao || errors.anoFundacao ) && (
                  <p className="text-xs text-red-600">
                    {errors.mesFundacao?.message || errors.anoFundacao?.message}
                  </p>
                )}
              </div>



              {/* Address Section */}
              <div className="space-y-4">
                <Label>Endereço</Label>
                <div className="grid grid-cols-12 gap-4">
                  {/* CEP Field */}
                  <div className="col-span-12 md:col-span-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...register( "cep" )}
                        placeholder="CEP"
                        className="pl-10"
                        onChange={( e ) => {
                          const value = e.target.value;
                          const numerics = value.replace( /\D/g, "" );
                          const formatted = normalizeCep( numerics );
                          setValue( "cep", formatted );

                          if ( numerics.length === 8 ) {
                            handleCepSearch( numerics );
                          }
                        }}
                      />
                    </div>
                    {errors.cep && (
                      <p className="text-xs text-red-600">{errors.cep.message}</p>
                    )}
                  </div>

                  {/* Address Fields */}
                  {showAddressFields && (
                    <>
                      <div className="col-span-12 md:col-span-8">
                        <Input
                          {...register( "logradouro" )}
                          placeholder="Logradouro"
                          disabled={isCepLoading}
                        />
                        {errors.logradouro && (
                          <p className="text-xs text-red-600">{errors.logradouro.message}</p>
                        )}
                      </div>

                      <div className="col-span-4 md:col-span-2">
                        <Input
                          {...register( "numero" )}
                          placeholder="Número"
                          onChange={( e ) => {
                            const value = e.target.value;
                            setValue( "numero", value );
                            updateBarbershopStore( "address", {
                              ...OnboardingStore.barbershopData.address,
                              number: value
                            } );
                          }}
                        />
                        {errors.numero && (
                          <p className="text-xs text-red-600">{errors.numero.message}</p>
                        )}
                      </div>

                      <div className="col-span-8 md:col-span-4">
                        <Input
                          {...register( "complemento" )}
                          placeholder="Complemento (opcional)"
                          onChange={( e ) => {
                            const value = e.target.value;
                            setValue( "complemento", value );
                            updateBarbershopStore( "address", {
                              ...OnboardingStore.barbershopData.address,
                              complement: value
                            } );
                          }}
                        />
                      </div>

                      <div className="col-span-12 md:col-span-4">
                        <Input
                          {...register( "bairro" )}
                          placeholder="Bairro"
                          disabled={isCepLoading}
                        />
                        {errors.bairro && (
                          <p className="text-xs text-red-600">{errors.bairro.message}</p>
                        )}
                      </div>

                      <div className="col-span-12 md:col-span-2">
                        <Input
                          {...register( "estado" )}
                          placeholder="UF"
                          disabled={isCepLoading}
                          maxLength={2}
                        />
                        {errors.estado && (
                          <p className="text-xs text-red-600">{errors.estado.message}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div >
          </div >
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">
              Informações de Contato da Barbearia
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                {/* Phone number section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mesmoTelefone"
                      checked={mesmoTelefone}
                      onCheckedChange={( checked: boolean ) => {
                        setMesmoTelefone( checked );
                        if ( checked ) {
                          const telefoneResponsavel = watch( "telefoneResponsavel" );
                          setValue( "telefoneBarbearia", telefoneResponsavel );
                          // Update store with the same phone number
                          updateBarbershopStore( "phone", telefoneResponsavel );
                        }
                      }}
                    />
                    <Label htmlFor="mesmoTelefone">
                      Usar o mesmo telefone informado anteriormente
                    </Label>
                  </div>

                  {!mesmoTelefone && (
                    <div className="space-y-2">
                      <Label htmlFor="telefoneBarbearia">
                        Telefone da Barbearia
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="telefoneBarbearia"
                          {...register( "telefoneBarbearia" )}
                          placeholder="(00) 00000-0000"
                          className="pl-10"
                          maxLength={15}
                          onChange={( e ) => {
                            const value = e.target.value;
                            const formatted = normalizePhoneNumber( value );
                            setValue( "telefoneBarbearia", formatted );
                            updateBarbershopStore( "phone", formatted );
                          }}
                        />
                      </div>
                      {errors.telefoneBarbearia && (
                        <p className="text-xs text-red-600">
                          {errors.telefoneBarbearia.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Email Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mesmoEmail"
                      checked={mesmoEmail}
                      onCheckedChange={( checked: boolean ) => {
                        setMesmoEmail( checked );
                        if ( checked ) {
                          const emailResponsavel = userStore.userData.email;
                          setValue( "email", emailResponsavel );
                          updateBarbershopStore( "email", emailResponsavel );
                        }
                      }}
                    />
                    <Label htmlFor="mesmoEmail">
                      Usar o mesmo e-mail informado anteriormente
                    </Label>
                  </div>

                  {!mesmoEmail && (
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail da Barbearia</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          {...register( "email" )}
                          type="email"
                          placeholder="contato@barbearia.com"
                          className="pl-10"
                          onChange={( e ) => {
                            const value = e.target.value;
                            setValue( "email", value );
                            updateBarbershopStore( "email", value );
                          }}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Horário de Funcionamento */}
                <div className="space-y-4">
                  <Label>Horário de Funcionamento</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="horarioAbertura">Abertura</Label>
                      <Select
                        onValueChange={( value ) => {
                          setValue( "horarioAbertura", value );
                          updateBarbershopStore( "businessHours", {
                            ...OnboardingStore.barbershopData.businessHours,
                            opening: value
                          } );
                        }}
                        value={watch( "horarioAbertura" ) || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from( { length: 24 }, ( _, i ) => (
                            <SelectItem
                              key={i}
                              value={`${i.toString().padStart( 2, "0" )}:00`}
                            >
                              {`${i.toString().padStart( 2, "0" )}:00`}
                            </SelectItem>
                          ) )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="horarioFechamento">Fechamento</Label>
                      <Select
                        onValueChange={( value ) => {
                          setValue( "horarioFechamento", value );
                          updateBarbershopStore( "businessHours", {
                            ...OnboardingStore.barbershopData.businessHours,
                            closing: value
                          } );
                        }}
                        value={watch( "horarioFechamento" ) || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from( { length: 24 }, ( _, i ) => (
                            <SelectItem
                              key={i}
                              value={`${i.toString().padStart( 2, "0" )}:00`}
                            >
                              {`${i.toString().padStart( 2, "0" )}:00`}
                            </SelectItem>
                          ) )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Finalização</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comoConheceu">
                    Como conheceu o BaberFlow?
                  </Label>
                  <Select
                    onValueChange={( value ) => {
                      setValue( "comoConheceu", value );
                      updateBarbershopStore( "howFound", value );
                    }}
                    value={watch( "comoConheceu" ) || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="redes-sociais">
                        Redes Sociais
                      </SelectItem>
                      <SelectItem value="indicacao">Indicação</SelectItem>
                      <SelectItem value="pesquisa">
                        Pesquisa na Internet
                      </SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectativas">
                    O que espera do nosso app?
                  </Label>
                  <Textarea
                    id="expectativas"
                    {...register( "expectativas" )}
                    placeholder="Conte-nos suas expectativas..."
                    onChange={( e ) => {
                      const value = e.target.value;
                      setValue( "expectativas", value );
                      updateBarbershopStore( "expectations", value );
                    }}
                  />
                  {errors.expectativas && (
                    <p className="text-xs text-red-600">
                      {errors.expectativas.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Pre-fill form with user data
  useEffect( () => {
    if ( userStore.userData ) {
      setValue(
        "nomeResponsavel",
        `${userStore.userData.firstName} ${userStore.userData.lastName}`,
      );
      updateBarbershopStore( "owner", `${userStore.userData.firstName} ${userStore.userData.lastName}` );
    }
  }, [ userStore.userData, setValue ] );

  // Adicione este useEffect para debug
  useEffect( () => {
    const disposer = autorun( () => {
      // console.log( 'UserStore State:', {
      //   userData: OnboardingStore.userData,
      //   barbershopData: OnboardingStore.barbershopData
      // } )
    } );

    return () => disposer();
  }, [ userStore ] );

  // Add this function inside the ConfigBarbearia component
  const updateBarbershopStore = ( field: string, value: string | number | object ) => {
    OnboardingStore.setBarbershopData( {
      ...OnboardingStore.barbershopData,
      [ field ]: value
    } );
  };

  const createBarbershop = async () => {
    setIsLoading( true );
    try {
      // Call the create function from BarbershopService
      const result = await BarbershopService.create( {
        name: OnboardingStore.barbershopData.name,
        owner: OnboardingStore.barbershopData.owner,
        phone: OnboardingStore.barbershopData.phone,
        foundationDate: OnboardingStore.barbershopData.foundationDate,
        email: OnboardingStore.barbershopData.email,
        address: {
          zipCode: OnboardingStore.barbershopData.address.zipCode,
          street: OnboardingStore.barbershopData.address.street,
          number: OnboardingStore.barbershopData.address.number,
          complement: OnboardingStore.barbershopData.address.complement || "",
          neighborhood: OnboardingStore.barbershopData.address.neighborhood,
          state: OnboardingStore.barbershopData.address.state,
        },
        businessHours: {
          opening: OnboardingStore.barbershopData.businessHours.opening,
          closing: OnboardingStore.barbershopData.businessHours.closing,
        },
      } );
      setIsLoading( false );
      // Navigate to the next step after successful creation
      navigate( "/" );
      return result;
    }
    catch ( error ) {
      console.error( "Erro ao criar barbearia:", error );
      toast.error( "Erro ao criar barbearia", {
        description: "Ocorreu um erro ao criar sua barbearia. Tente novamente mais tarde.",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      } );
      setIsLoading( false );
      return;

    }
  }
  // Add this function inside ConfigBarbearia component
  const isStepValid = ( step: number ) => {
    const formValues = watch();

    switch ( step ) {
      case 0:
        // Welcome screen - always valid
        return true;

      case 1:
        // Basic data validation
        return (
          formValues.nomeBarbearia?.length >= 3 &&
          formValues.mesFundacao?.length > 0 &&
          formValues.anoFundacao?.length === 4 &&
          formValues.cep?.length === 9 &&
          formValues.logradouro?.length >= 5 &&
          formValues.numero?.length > 0 &&
          formValues.bairro?.length >= 3 &&
          formValues.estado?.length === 2
        );

      case 2:
        // Contact information validation
        return (
          formValues.telefoneBarbearia?.length >= 14 &&
          formValues.email?.includes( '@' ) &&
          formValues.horarioAbertura?.length > 0 &&
          formValues.horarioFechamento?.length > 0
        );

      case 3:
        // Final step - optional fields
        return true;

      default:
        return false;
    }
  };

  const triggerConfetti = () => {
    // Duration: 3 seconds
    const end = Date.now() + 1000;

    // More vibrant colors
    const colors = [
      '#FF0000', // Red
      '#00FF00', // Green
      '#0000FF', // Blue
      '#FFFF00', // Yellow
      '#FF00FF', // Magenta
      '#00FFFF', // Cyan
      '#FFA500', // Orange
      '#800080', // Purple
      '#FFC0CB', // Pink
    ];

    ( function frame() {
      confetti( {
        particleCount: 50,
        angle: 60,
        spread: 100,
        origin: { x: 0, y: 0.8 },
        colors: colors,
        shapes: [ 'square', 'circle' ],
        ticks: 200,
        scalar: 1.2,
        drift: 0,
        gravity: 1.5,
      } );

      confetti( {
        particleCount: 50,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.8 },
        colors: colors,
        shapes: [ 'square', 'circle' ],
        ticks: 200,
        scalar: 1.2,
        drift: 0,
        gravity: 1.5,
      } );

      // Fire from the middle
      confetti( {
        particleCount: 30,
        angle: 90,
        spread: 360,
        origin: { x: 0.5, y: 0.8 },
        colors: colors,
        shapes: [ 'star' ],
        ticks: 200,
        scalar: 1.2,
        drift: 0,
        gravity: 1,
      } );

      if ( Date.now() < end ) {
        requestAnimationFrame( frame );
      }
    } )();
  };

  // Update the return statement to conditionally render the progress indicators
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900 rounded-full opacity-20 blur-3xl animate-pulse-slow" />
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-t from-blue-900 via-blue-600 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow animation-delay-2000" />

      {/* Logo */}
      <div className="absolute top-6 md:top-8 left-1/2 md:left-8 transform md:transform-none -translate-x-1/2 md:translate-x-0 z-10">
        <img src={Logo} alt="Barberflow" className="h-8 md:h-10 w-auto" />
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-3xl shadow-xl z-10 bg-white/80 backdrop-blur-md mt-16 md:mt-0">
        <form onSubmit={handleSubmit( onSubmit )}>
          <div className="p-6">
            {/* Progress indicator - Only show after welcome screen */}
            {currentStep > 0 && (
              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  {steps.map( ( step, index ) => (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center ${index <= currentStep ? "text-primary" : "text-slate-500"
                        }`}
                    >
                      <div
                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center mb-2
                        ${index <= currentStep ? "bg-primary text-primary-foreground" : "bg-slate-100"}
                      `}
                      >
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{step.title}</span>
                      <span className="text-slate-500 text-xs">
                        {step.description}
                      </span>
                    </div>
                  ) )}
                </div>
                <Progress
                  value={( currentStep + 1 ) * ( 100 / steps.length )}
                  className="h-2"
                />
              </div>
            )}

            {/* Content */}
            <div className={currentStep === 0 ? "" : "min-h-[400px]"}>
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-4 border-t">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep( ( prev ) => prev - 1 )}
                  disabled={isLoading}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              )}

              <Button
                type={currentStep === steps.length - 1 ? "submit" : "button"}
                onClick={
                  currentStep === steps.length - 1
                    ? async () => {
                      await createBarbershop();
                    }
                    : () => setCurrentStep( ( prev ) => prev + 1 )
                }
                disabled={isLoading || ( currentStep > 0 && !isStepValid( currentStep ) )}
                className={currentStep === 0 ? "ml-auto" : ""}
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
} );

export default ConfigBarbearia;
