'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, PartyPopper } from 'lucide-react';
import { Confetti } from '@/components/ui/confetti';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { volunteerFormSchema, type VolunteerFormData } from '@/lib/validations/volunteer';
import {
  AGE_RANGES,
  SEX_OPTIONS,
  VOLUNTEER_TYPES,
  DURATION_OPTIONS,
  DISTRICTS,
} from '@/lib/constants';

export function VolunteerForm() {
  const t = useTranslations('form');
  const tc = useTranslations('common');
  const td = useTranslations('districts');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      whatsapp: '',
      district: '',
      availableDistricts: [],
    },
  });

  async function onSubmit(data: VolunteerFormData) {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/volunteer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Submission failed');

      setSubmitStatus('success');
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl border border-white/20 bg-white/80 backdrop-blur-lg">
      <CardHeader className="space-y-2 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border-b border-white/20 backdrop-blur-sm">
        <CardTitle className="text-2xl md:text-3xl text-primary">{tc('title')}</CardTitle>
        <CardDescription className="text-base">{tc('subtitle')}</CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                {t('personalInfo')}
              </h3>

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      {t('name')} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('namePlaceholder')}
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      {t('email')} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WhatsApp Number */}
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      {t('whatsapp')} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder={t('whatsappPlaceholder')}
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Age Range */}
                <FormField
                  control={form.control}
                  name="ageRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {t('ageRange')} <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={tc('select')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AGE_RANGES.map((range) => (
                            <SelectItem key={range} value={range}>
                              {t(`ageOptions.${range}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sex */}
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {t('sex')} <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={tc('select')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SEX_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {t(`sexOptions.${option}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Current District */}
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      {t('district')} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('districtPlaceholder')}
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Volunteer Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                {t('volunteerInfo')}
              </h3>

              {/* Volunteer Type */}
              <FormField
                control={form.control}
                name="volunteerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      {t('volunteerType')} <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={tc('select')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {VOLUNTEER_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {t(`volunteerTypeOptions.${type}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {t('startDate')} <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="h-11"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Duration */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {t('duration')} <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={tc('select')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DURATION_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {t(`durationOptions.${option}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Available Districts */}
              <FormField
                control={form.control}
                name="availableDistricts"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        {t('availableDistricts')} <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormDescription>{t('selectMultiple')}</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {DISTRICTS.map((district) => (
                        <FormField
                          key={district}
                          control={form.control}
                          name="availableDistricts"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={district}
                                className="flex flex-row items-start space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(district)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), district])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== district)
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {td(district)}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Status Messages */}
            {submitStatus === 'success' && (
              <>
                <Confetti />
                <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 p-4 text-green-800 animate-in fade-in slide-in-from-bottom-5 duration-500">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                    <PartyPopper className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Registration Successful!</p>
                    <p className="text-sm text-green-700">{t('successMessage')}</p>
                  </div>
                </div>
              </>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-500 p-4 text-red-800 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Submission Failed</p>
                  <p className="text-sm text-red-700">{t('errorMessage')}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {tc('loading')}
                </>
              ) : (
                tc('submit')
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
