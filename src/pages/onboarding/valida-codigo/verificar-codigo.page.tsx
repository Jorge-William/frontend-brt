import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { UsersService } from "@/services/users/users-service";
import { toast } from "sonner";
import { observer } from "mobx-react-lite";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Logo from "@/assets/logos/5.svg";
import OnboardingStore from "@/stores/OnboardingStore";

const verificationSchema = z.object( {
  code: z.string().length( 6, { message: "O código deve ter 6 dígitos" } ),
} );

type VerificationFormValues = z.infer<typeof verificationSchema>;

// const EXPIRATION_TIME = 5 * 60; // 5 minutes in seconds

const VerificarCodigoPage = observer( () => {
  const navigate = useNavigate();
  const userStore = OnboardingStore;

  const [ isLoading, setIsLoading ] = useState( false );
  const [ timeLeft, setTimeLeft ] = useState( 30 ); // Reduzido para 30 segundos
  const [ canResend, setCanResend ] = useState( false );
  const [ code, setCode ] = useState( "" );

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VerificationFormValues>( {
    resolver: zodResolver( verificationSchema ),
  } );

  // Timer countdown
  useEffect( () => {
    if ( timeLeft <= 0 ) {
      setCanResend( true );
      return;
    }

    const timer = setInterval( () => {
      setTimeLeft( ( prev ) => prev - 1 );
    }, 1000 );

    return () => clearInterval( timer );
  }, [ timeLeft ] );

  // Format remaining time
  const formatTime = ( seconds: number ) => {
    return `${seconds} segundos`;
  };

  // Redirect if no email in state
  useEffect( () => {
    if ( !userStore.userData?.email ) {
      navigate( "/onboarding/novo-usuario" );
    }
  }, [ userStore.userData, navigate ] );

  // Atualiza o valor do código quando o InputOTP muda
  const handleCodeChange = ( value: string ) => {
    setCode( value );
    setValue( "code", value );
  };

  const onSubmit = async () => {
    if ( code.length !== 6 ) return;

    setIsLoading( true );
    try {
      const result = await UsersService.verifyEmail( {
        email: userStore.userData?.email as string,
        code: code, // Usa o estado do código ao invés do valor do form
      } );

      if ( result instanceof Error ) {
        toast.error( "Código inválido" );
      } else {
        toast.success( "Email verificado com sucesso!" );
        navigate( "/onboarding/assinatura" );
      }
    } catch ( error ) {
      console.error( "Error verifying code:", error );
      toast.error( "Erro ao verificar código" );
    } finally {
      setIsLoading( false );
    }
  };

  const handleResendCode = async () => {
    if ( !userStore.userData?.email || !canResend ) return;

    setIsLoading( true );
    try {
      const result = await UsersService.resendVerificationCode( {
        email: userStore.userData.email,
      } );

      if ( result instanceof Error ) {
        toast.error( "Erro ao reenviar código", {
          description: result.message,
        } );
      } else {
        // Reseta o código atual
        setCode( "" );
        // Reseta o timer
        setTimeLeft( 30 );
        setCanResend( false );
        toast.success( "Novo código enviado!", {
          description: `Verifique sua caixa de entrada: ${userStore.userData.email}`,
        } );
      }
    } catch ( error ) {
      console.log( "Error resending code:", error );

      toast.error( "Erro ao reenviar código", {
        description: "Tente novamente em alguns instantes",
      } );
    } finally {
      setIsLoading( false );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-t from-blue-900 via-blue-600 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow animation-delay-2000"></div>

      {/* Logo */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
        <img src={Logo} alt="Barberflow" className="h-8 md:h-10 w-auto" />
      </div>

      {/* Verification Card */}
      <Card className="w-full max-w-md shadow-xl z-10 bg-white/80 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle>Verificação de Email</CardTitle>
          <CardDescription>
            Digite o código de verificação enviado para{" "}
            {userStore.userData?.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit( onSubmit )} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5 items-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={handleCodeChange}
                  disabled={isLoading}
                  containerClassName="gap-4" // Aumenta o espaço entre os inputs
                  render={( { slots } ) => (
                    <InputOTPGroup>
                      {slots.map( ( slot, index ) => (
                        <InputOTPSlot
                          key={index}
                          {...slot}
                          className={`
                            w-14 h-14 text-center text-2xl font-medium
                            border-2 rounded-md
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-150
                            flex items-center justify-center
                          `}
                        />
                      ) )}
                    </InputOTPGroup>
                  )}
                />
                {errors.code && (
                  <p className="text-xs text-red-600 mt-2">
                    {errors.code.message}
                  </p>
                )}
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">Não recebeu o código?</p>
                {canResend ? (
                  <Button
                    variant="ghost"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-primary hover:text-primary/80"
                    type="button"
                  >
                    Reenviar código
                  </Button>
                ) : (
                  <p className="text-xs text-gray-400">
                    Reenviar código em {formatTime( timeLeft )}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} );

export default VerificarCodigoPage;
