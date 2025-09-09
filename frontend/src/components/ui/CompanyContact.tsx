'use client';
import clsx from 'clsx';
import { Mail, Phone, Globe, MapPin, ExternalLink, Building2 } from 'lucide-react';
import * as React from 'react';

export interface CompanyContactProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  addressHtml?: string; // peut contenir <br>
  supportUrl?: string;
}

/** Présentation compacte des informations de contact d'une enseigne. */
export default function CompanyContact({
  name,
  website,
  email,
  phone,
  addressHtml,
  supportUrl,
  className,
  ...rest
}: CompanyContactProps) {
  return (
    <section
      aria-labelledby="company-contact-title"
      className={clsx('rounded-2xl border border-gray-200 bg-white p-4 sm:p-5', className)}
      {...rest}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
          <Building2 className="h-6 w-6" aria-hidden />
        </div>
        <h3 id="company-contact-title" className="text-lg font-semibold text-gray-900">
          {name}
        </h3>
      </div>

      <ul className="mt-3 space-y-2 text-sm text-gray-700">
        {website && (
          <li className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" aria-hidden />
            <a
              className="link inline-flex items-center gap-1 text-blue-700 hover:underline"
              href={website}
              target="_blank"
              rel="noreferrer"
            >
              Site web <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </li>
        )}
        {supportUrl && (
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-gray-500" aria-hidden />
            <a
              className="link inline-flex items-center gap-1 text-blue-700 hover:underline"
              href={supportUrl}
              target="_blank"
              rel="noreferrer"
            >
              Support / SAV <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </li>
        )}
        {email && (
          <li className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" aria-hidden />
            <a className="text-blue-700 hover:underline" href={`mailto:${email}`}>
              {email}
            </a>
          </li>
        )}
        {phone && (
          <li className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" aria-hidden />
            <a className="text-blue-700 hover:underline" href={`tel:${phone}`}>
              {phone}
            </a>
          </li>
        )}
        {addressHtml && (
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-gray-500" aria-hidden />
            <span dangerouslySetInnerHTML={{ __html: addressHtml }} />
          </li>
        )}
      </ul>
    </section>
  );
}
