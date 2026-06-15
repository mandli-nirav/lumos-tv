import { Mail, Send, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import { LegalPage } from '@/components/legal/LegalPage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LEGAL } from '@/config/legal';

/**
 * Contact page.
 *
 * The site is a static SPA with no backend, so the message form composes a
 * `mailto:` link and hands off to the visitor's email client rather than
 * posting to a server (which would silently fail). Direct addresses are also
 * listed so the page is useful even if the form is not used.
 */
export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use native constraint validation before composing the mailto.
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:${LEGAL.contactEmail}?subject=${encodeURIComponent(
      form.subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <LegalPage
      title='Contact Us'
      intro='Have a question, suggestion, or copyright concern? Reach out using the details below or send us a message.'
    >
      {/* Contact methods */}
      <div className='mt-2 grid gap-4 sm:grid-cols-2'>
        <Card className='gap-3 p-5'>
          <Mail className='text-primary h-6 w-6' aria-hidden />
          <div className='space-y-1'>
            <span className='text-foreground block font-semibold'>
              General Enquiries
            </span>
            <span className='text-muted-foreground block text-sm'>
              Questions, feedback, and partnership requests.
            </span>
          </div>
          <a href={`mailto:${LEGAL.contactEmail}`} className='text-sm font-semibold'>
            {LEGAL.contactEmail}
          </a>
        </Card>

        <Card className='gap-3 p-5'>
          <ShieldCheck className='text-primary h-6 w-6' aria-hidden />
          <div className='space-y-1'>
            <span className='text-foreground block font-semibold'>
              Copyright / DMCA
            </span>
            <span className='text-muted-foreground block text-sm'>
              Takedown notices &mdash; see our <a href='/dmca'>DMCA Policy</a>.
            </span>
          </div>
          <a href={`mailto:${LEGAL.dmcaEmail}`} className='text-sm font-semibold'>
            {LEGAL.dmcaEmail}
          </a>
        </Card>
      </div>

      <h2>Send Us a Message</h2>
      <p>
        Submitting this form opens your email application with the details
        pre-filled, addressed to{' '}
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
      </p>

      <form onSubmit={handleSubmit} className='mt-6 space-y-4' noValidate>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='contact-name'>Name</Label>
            <Input
              id='contact-name'
              value={form.name}
              onChange={update('name')}
              placeholder='Your name'
              autoComplete='name'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='contact-email'>Email</Label>
            <Input
              id='contact-email'
              type='email'
              value={form.email}
              onChange={update('email')}
              placeholder='you@example.com'
              autoComplete='email'
              required
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='contact-subject'>Subject</Label>
          <Input
            id='contact-subject'
            value={form.subject}
            onChange={update('subject')}
            placeholder='How can we help?'
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='contact-message'>Message</Label>
          <Textarea
            id='contact-message'
            value={form.message}
            onChange={update('message')}
            placeholder='Write your message…'
            className='min-h-32'
            required
          />
        </div>

        <Button type='submit' className='w-full sm:w-auto'>
          <Send className='mr-2 h-4 w-4' />
          Send Message
        </Button>
      </form>
    </LegalPage>
  );
}
