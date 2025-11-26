'use client';

import * as React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, LifeBuoy, ShieldAlert, Send, Loader2, Info } from 'lucide-react';

import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { cn } from '@/lib/utils';

// shadcn/ui
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

type Reason = 'general' | 'support';

const schema = z.object({
  reason: z.enum(['general', 'support']),
  name: z.string().min(2, 'Indiquez votre nom.'),
  email: z.string().email('Email invalide.'),
  subject: z.string().min(3, 'Sujet trop court.'),
  message: z.string().min(20, 'Décrivez un peu plus votre demande.'),
  acceptNoLegalAdvice: z.literal(true, {
    errorMap: () => ({
      message:
        'Merci de confirmer que vous avez compris que nous ne donnons pas de conseil juridique.',
    }),
  }),
});

type FormValues = z.infer<typeof schema>;

const DEFAULT_VALUES: FormValues = {
  reason: 'general',
  name: '',
  email: '',
  subject: '',
  message: '',
  acceptNoLegalAdvice: true,
};

function tabTriggerClass(active: boolean) {
  return cn(
    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors border',
    active
      ? 'bg-blue-600 text-white border-blue-600'
      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
  );
}

export default function ContactClientPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<Reason>('general');
  const [loading, setLoading] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  });

  // sync tab -> form.reason
  React.useEffect(() => {
    form.setValue('reason', activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'Erreur serveur');
      }

      toast({
        title: 'Message envoyé ✅',
        description:
          activeTab === 'support'
            ? 'Le support a bien reçu votre message.'
            : 'Merci ! Nous vous répondrons rapidement.',
      });

      form.reset({ ...DEFAULT_VALUES, reason: activeTab });
    } catch (e: any) {
      toast({
        title: 'Impossible d’envoyer le message',
        description: e?.message ?? 'Réessayez dans un instant.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const breadcrumbItems = [{ label: 'Contact', isCurrentPage: true }];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative border-b border-gray-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/40"
        />
        <Container>
          <div className="px-4 py-8 sm:py-10">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="mt-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Contact
                </Badge>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Nous contacter
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                Une question générale, une remarque, ou un problème technique ? Écrivez-nous ici.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="px-4 py-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
            {/* MAIN */}
            <div className="space-y-6">
              {/* Tabs */}
              <Tabs.Root
                value={activeTab}
                onValueChange={v => setActiveTab(v as Reason)}
                className="w-full"
              >
                <Tabs.List className="flex flex-wrap gap-2">
                  <Tabs.Trigger value="general" asChild>
                    <button type="button" className={tabTriggerClass(activeTab === 'general')}>
                      <Mail className="h-4 w-4" />
                      Contact général
                    </button>
                  </Tabs.Trigger>
                  <Tabs.Trigger value="support" asChild>
                    <button type="button" className={tabTriggerClass(activeTab === 'support')}>
                      <LifeBuoy className="h-4 w-4" />
                      Support technique / commandes
                    </button>
                  </Tabs.Trigger>
                </Tabs.List>
              </Tabs.Root>

              {/* Disclaimer strong */}
              <Alert className="border-blue-100 bg-blue-50/60">
                <ShieldAlert className="h-4 w-4 text-blue-700" />
                <AlertTitle className="text-blue-900 font-semibold">
                  Pas de conseil juridique
                </AlertTitle>
                <AlertDescription className="text-blue-900/90 text-sm">
                  Nous fournissons un outil d’assistance basé sur des informations générales. Pour
                  un avis sur votre situation personnelle, consultez un professionnel du droit.
                </AlertDescription>
              </Alert>

              {/* Form Card */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center">
                      {activeTab === 'support' ? (
                        <LifeBuoy className="h-5 w-5" />
                      ) : (
                        <Mail className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        {activeTab === 'support' ? 'Contacter le support' : 'Nous écrire'}
                      </h2>
                      <p className="text-xs text-gray-600">
                        Réponse en général sous 24–48h ouvrées.
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-5">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre nom" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="vous@exemple.fr" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sujet</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  activeTab === 'support'
                                    ? 'Ex: Problème de paiement / PDF / envoi recommandé'
                                    : 'Ex: Question générale, remarque, partenariat…'
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Soyez précis, cela aide à traiter plus vite.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={7}
                                placeholder={
                                  activeTab === 'support'
                                    ? 'Décrivez le problème, l’appareil, le navigateur, et si possible la référence de commande.'
                                    : 'Dites-nous ce que vous avez en tête 🙂'
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={form.control}
                        name="acceptNoLegalAdvice"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm">
                                Je comprends que Je me défends ne fournit pas de conseil juridique
                                personnalisé.
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                        rightIcon={undefined as any}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Envoi…
                          </>
                        ) : (
                          <>
                            Envoyer
                            <Send className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>

                <CardFooter className="pt-0">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" />
                    Vos données ne sont utilisées que pour vous répondre.
                  </p>
                </CardFooter>
              </Card>
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-6">
              <Card className="border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/60">
                <CardHeader>
                  <h3 className="text-base font-extrabold tracking-tight text-blue-900">
                    Besoin d’une lettre ?
                  </h3>
                  <p className="text-sm text-blue-900/90">
                    Lancez le diagnostic gratuit et générez la mise en demeure adaptée.
                  </p>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <a href="/eligibilite#start">Vérifier mon éligibilité</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <h3 className="text-base font-bold text-gray-900">Avant de nous écrire</h3>
                  <p className="text-sm text-gray-600">
                    Les réponses aux questions les plus courantes sont ici :
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a
                    href="/faq"
                    className="block rounded-xl border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">FAQ</div>
                    <div className="text-xs text-gray-600">
                      Garantie légale, recours, délais, etc.
                    </div>
                  </a>
                  <a
                    href="/guides/garantie-legale-conformite-guide-complet"
                    className="block rounded-xl border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Guide complet</div>
                    <div className="text-xs text-gray-600">Tous vos droits en détail</div>
                  </a>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </Container>
    </div>
  );
}
