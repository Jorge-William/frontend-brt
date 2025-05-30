import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { UsersService } from '@/services/users/users-service';
import { toast, Toaster } from 'sonner';

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
import Logo from '@/assets/logos/5.svg';

// Validation schema
const verificationSchema = z.object( {
  code: z.string().length( 6, { message: "O código deve ter 6 dígitos" } )
} );

type VerificationFormValues = z.infer<typeof verificationSchema>;

const EXPIRATION_TIME = 5 * 60; // 5 minutes in seconds

export default function VerificarCodigoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [ isLoading, setIsLoading ] = useState( false );
  const [ timeLeft, setTimeLeft ] = useState( EXPIRATION_TIME );
  const [ isExpired, setIsExpired ] = useState( false );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormValues>( {
    resolver: zodResolver( verificationSchema )
  } );

  // Timer countdown
  useEffect( () => {
    if ( timeLeft <= 0 ) {
      setIsExpired( true );
      return;
    }

    const timer = setInterval( () => {
      setTimeLeft( prev => prev - 1 );
    }, 1000 );

    return () => clearInterval( timer );
  }, [ timeLeft ] );

  // Format remaining time
  const formatTime = ( seconds: number ) => {
    const minutes = Math.floor( seconds / 60 );
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart( 2, '0' )}`;
  };

  // Redirect if no email in state
  useEffect( () => {
    if ( !email ) {
      navigate( '/criar-conta' );
    }
  }, [ email, navigate ] );

  const onSubmit = async ( data: VerificationFormValues ) => {
    if ( isExpired ) return;

    setIsLoading( true );
    try {
      const result = await UsersService.verifyEmail( {
        email,
        code: data.code
      } );

      if ( result instanceof Error ) {
        toast.error( 'Código inválido' );
      } else {
        toast.success( 'Email verificado com sucesso!' );
        navigate( '/dashboard' );
      }
    } catch ( error ) {
      console.error( 'Error verifying code:', error );
      toast.error( 'Erro ao verificar código' );
    } finally {
      setIsLoading( false );
    }
  };

  const handleResendCode = async () => {
    if ( !email ) {
      toast.error( 'Email não encontrado. Por favor, tente novamente.' );
      navigate( '/criar-conta' );
      return;
    }

    setIsLoading( true );
    try {
      const result = await UsersService.resendVerificationCode( { email } );

      if ( result instanceof Error ) {
        toast.error( 'Erro ao reenviar código', {
          description: result.message
        } );
      } else {
        setTimeLeft( EXPIRATION_TIME );
        setIsExpired( false );
        toast.success( 'Novo código enviado!', {
          description: `Um novo código foi enviado para ${email}`
        } );
      }
    } catch ( error ) {
      console.log( 'Error resending code:', error );

      toast.error( 'Erro ao reenviar código', {
        description: 'Ocorreu um erro inesperado. Tente novamente.'
      } );
    } finally {
      setIsLoading( false );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-50 p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-t from-blue-900 via-blue-600 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow animation-delay-2000"></div>

      {/* Logo */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
        <img src={Logo} alt="Barberflow" className="h-8 md:h-10 w-auto" />
      </div>

      {/* Features Section - Visible only on desktop */}
      <div className="hidden lg:block w-full max-w-md p-8">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Confirme seu email</h2>
            <p className="text-gray-600">Enviamos um código de verificação para seu email.</p>
          </div>
        </div>
      </div>

      {/* Verification Card */}
      <Card className="w-full max-w-md shadow-xl z-10 bg-white/80 backdrop-blur-md lg:ml-8">
        <CardHeader>
          <CardTitle>Verificação</CardTitle>
          <CardDescription>
            Digite o código de 6 dígitos enviado para {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit( onSubmit )}>
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="code"
                  placeholder="000000"
                  {...register( 'code' )}
                  disabled={isLoading || isExpired}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
                {errors.code && (
                  <p className="text-xs text-red-600">{errors.code.message}</p>
                )}
              </div>

              <div className="text-center">
                <p className={`text-sm ${isExpired ? 'text-red-600' : 'text-gray-500'}`}>
                  {isExpired ? 'Código expirado' : `Código expira em ${formatTime( timeLeft )}`}
                </p>
              </div>

              <Button type="submit" disabled={isLoading || isExpired}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verificar
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="ghost"
            onClick={handleResendCode}
            disabled={isLoading || !isExpired}
          >
            Reenviar código
          </Button>
        </CardFooter>
      </Card>

      <Toaster />
    </div>
  );
}