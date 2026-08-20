'use client';

import {
  AlertTriangle,
  BadgeCheck,
  Camera,
  Check,
  CircleAlert,
  ImagePlus,
  Info,
  Pencil,
  ShieldCheck,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

import { AppHeader } from '@/components/app/AppHeader';
import { Button, ButtonLink } from '@/components/ui/Button';

type Step = 'intro' | 'property' | 'selfie' | 'photo' | 'address' | 'identity' | 'review';
type DocId = 'PROPERTY' | 'PHOTO' | 'ADDRESS' | 'ELECTRICITY' | 'IDENTITY';
type DocStatus = 'pending' | 'submitted' | 'verified';

const FLOW: Step[] = ['intro', 'property', 'selfie', 'photo', 'address', 'identity', 'review'];

const DOCS: { id: DocId; label: string }[] = [
  { id: 'PROPERTY', label: 'Property ownership' },
  { id: 'PHOTO', label: 'Photo and name' },
  { id: 'ADDRESS', label: 'Charging spot address' },
  { id: 'ELECTRICITY', label: 'Electricity connection' },
  { id: 'IDENTITY', label: 'Aadhaar or PAN card' },
];

const allDocs = (s: DocStatus): Record<DocId, DocStatus> => ({
  PROPERTY: s,
  PHOTO: s,
  ADDRESS: s,
  ELECTRICITY: s,
  IDENTITY: s,
});

export default function HostKycPage() {
  const [step, setStep] = useState<Step>('intro');
  const [docs, setDocs] = useState<Record<DocId, DocStatus>>(allDocs('pending'));

  const [whatsapp, setWhatsapp] = useState(true);
  const [showReferral, setShowReferral] = useState(false);
  const [referral, setReferral] = useState('');

  const [ownership, setOwnership] = useState<'owner' | 'tenant' | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  const [address, setAddress] = useState('');
  const [consumerNo, setConsumerNo] = useState('');

  const [idType, setIdType] = useState<'aadhaar' | 'pan'>('aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [idPhoto, setIdPhoto] = useState<string | null>(null);

  const index = FLOW.indexOf(step);
  const back = () => index > 0 && setStep(FLOW[index - 1]);

  const verified = docs.IDENTITY === 'verified';

  const title = useMemo(
    () =>
      ({
        intro: undefined,
        property: undefined,
        selfie: 'Selfie',
        photo: 'Photo and name',
        address: 'Charging spot',
        identity: 'Aadhaar or PAN',
        review: 'Documents',
      })[step],
    [step]
  );

  const idValid = idType === 'aadhaar' ? idNumber.length === 12 : idNumber.length === 10;

  return (
    <div className="min-h-dvh bg-white">
      <AppHeader title={title} back="/host" />

      {/* progress */}
      {step !== 'review' && (
        <div className="shell flex gap-1.5 py-3">
          {FLOW.slice(0, -1).map((s, i) => (
            <span
              key={s}
              className={`h-1 flex-1 rounded-full ${i <= index ? 'bg-emerald' : 'bg-line'}`}
            />
          ))}
        </div>
      )}

      <main className="shell max-w-xl pb-16">
        {step === 'intro' && (
          <section>
            <div className="grid h-20 w-20 place-items-center rounded-full bg-green-light">
              <User className="h-9 w-9 text-emerald" />
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy">Hello there</h2>
            <p className="mt-1 text-lg text-navy/80">Register yourself as a ChargeSetu Host</p>

            <div className="mt-7 rounded-card bg-surface p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.checked)}
                  className="h-5 w-5 accent-emerald"
                />
                <span className="flex-1 text-[15px] font-medium text-navy">
                  Receive account updates on WhatsApp
                </span>
              </label>
              <div className="mt-3 rounded-lg border border-line bg-white px-4 py-3">
                <span className="text-[17px] font-medium text-navy">+91 99932 04200</span>
              </div>
            </div>

            {showReferral ? (
              <input
                value={referral}
                onChange={(e) => setReferral(e.target.value.toUpperCase())}
                placeholder="Referral code"
                aria-label="Referral code"
                className="mt-6 w-full rounded-lg border border-line bg-surface px-4 py-3 text-base outline-none focus:border-emerald"
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowReferral(true)}
                className="mt-6 text-[15px] font-semibold text-emerald hover:underline"
              >
                Have a Referral Code?
              </button>
            )}

            <Button
              size="lg"
              className="mt-10 w-full rounded-full"
              onClick={() => setStep('property')}
            >
              Register as a Host
            </Button>
          </section>
        )}

        {step === 'property' && (
          <StepShell
            heading="Do you own this property?"
            sub="Tenants can host too — we just ask for the owner's consent before going live."
            onBack={back}
            onNext={() => {
              setDocs((d) => ({ ...d, PROPERTY: 'submitted' }));
              setStep('selfie');
            }}
            nextDisabled={!ownership}
          >
            <div className="mt-6 divide-y divide-line border-y border-line">
              {[
                { v: 'owner' as const, t: 'Yes', s: 'I own the property' },
                { v: 'tenant' as const, t: 'No', s: 'I rent — landlord consent needed' },
              ].map((o) => (
                <label key={o.v} className="flex cursor-pointer items-center gap-4 py-4">
                  <span className="flex-1">
                    <span className="block text-lg font-semibold text-navy">{o.t}</span>
                    <span className="block text-sm text-muted">{o.s}</span>
                  </span>
                  <input
                    type="radio"
                    name="ownership"
                    checked={ownership === o.v}
                    onChange={() => setOwnership(o.v)}
                    className="h-5 w-5 accent-emerald"
                  />
                </label>
              ))}
            </div>
          </StepShell>
        )}

        {step === 'selfie' && (
          <StepShell
            heading="Take a selfie"
            sub="Riders see this photo when they book. Face the camera in good light."
            onBack={back}
            onNext={() => setStep('photo')}
            nextDisabled={!selfie}
            skip={() => setStep('photo')}
          >
            <PhotoDrop
              value={selfie}
              onChange={setSelfie}
              className="mt-6 aspect-[3/4] max-h-[380px]"
              placeholder={
                <>
                  <Camera className="h-11 w-11 text-muted" />
                  <span className="text-sm text-muted">Tap to take or upload a photo</span>
                </>
              }
            />
            {selfie && (
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald">
                <Check className="h-4 w-4" /> Photo Submitted
              </p>
            )}
          </StepShell>
        )}

        {step === 'photo' && (
          <StepShell
            heading=""
            onBack={back}
            onNext={() => {
              setDocs((d) => ({ ...d, PHOTO: 'submitted' }));
              setStep('address');
            }}
            nextDisabled={fullName.trim().length < 2 || !gender}
          >
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full border-4 border-emerald bg-surface">
                  {selfie ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selfie} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-muted" />
                  )}
                </div>
                <span className="absolute -right-1 top-1 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-emerald">
                  <Pencil className="h-3.5 w-3.5 text-white" />
                </span>
              </div>
              <PhotoDrop value={null} onChange={setSelfie} asLink label="Edit Profile Photo" />
            </div>

            <Field label="Full Name" required>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Animesh Agrawal"
                className={inputCls}
              />
            </Field>

            <Field label="Date of Birth">
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} />
            </Field>

            <Field label="Gender" required>
              <div className="grid grid-cols-2 gap-3">
                {(['male', 'female'] as const).map((g) => (
                  <label
                    key={g}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 ${
                      gender === g ? 'border-emerald bg-green-light' : 'border-line'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === g}
                      onChange={() => setGender(g)}
                      className="h-4.5 w-4.5 accent-emerald"
                    />
                    <span className="font-medium capitalize text-navy">{g}</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">
                Riders can filter for women hosts, so this feeds matching as well as your profile.
              </p>
            </Field>
          </StepShell>
        )}

        {step === 'address' && (
          <StepShell
            heading=""
            onBack={back}
            onNext={() => {
              setDocs((d) => ({
                ...d,
                ADDRESS: 'submitted',
                ELECTRICITY: consumerNo ? 'submitted' : 'pending',
              }));
              setStep('identity');
            }}
            nextDisabled={address.trim().length < 6}
          >
            <div className="flex items-start gap-2.5 rounded-lg bg-[#EAF1FE] p-3.5">
              <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#1A73E8]" />
              <p className="text-sm text-[#1A73E8]">
                The full address reaches a rider only after you accept their booking.
              </p>
            </div>

            <Field label="Address of your charging spot" required>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="House / street / area, Indore"
                className={`${inputCls} resize-none`}
              />
            </Field>

            <Field label="Electricity consumer number">
              <input
                value={consumerNo}
                onChange={(e) =>
                  setConsumerNo(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 14))
                }
                placeholder="From your electricity bill"
                className={inputCls}
              />
              <p className="mt-2 text-xs text-muted">
                Confirms the socket sits on a domestic tariff, which is what keeps home charging
                de-licensed. Not compulsory for the pilot.
              </p>
            </Field>
          </StepShell>
        )}

        {step === 'identity' && (
          <StepShell
            heading=""
            onBack={back}
            onNext={() => {
              setDocs(allDocs('submitted'));
              setStep('review');
            }}
            nextLabel="Submit"
            nextDisabled={!idValid}
          >
            <Field label="Select ID to upload">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: 'aadhaar' as const, t: 'Aadhaar' },
                  { v: 'pan' as const, t: 'PAN Card' },
                ].map((o) => (
                  <label
                    key={o.v}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border-2 px-4 py-4 ${
                      idType === o.v ? 'border-[#1A73E8] bg-[#EAF1FE]' : 'border-line'
                    }`}
                  >
                    <span className="text-[17px] font-semibold text-navy">{o.t}</span>
                    <input
                      type="radio"
                      name="idtype"
                      checked={idType === o.v}
                      onChange={() => {
                        setIdType(o.v);
                        setIdNumber('');
                      }}
                      className="h-4.5 w-4.5 accent-[#1A73E8]"
                    />
                  </label>
                ))}
              </div>
            </Field>

            <PhotoDrop
              value={idPhoto}
              onChange={setIdPhoto}
              className="mt-5 h-40"
              placeholder={
                <>
                  <ImagePlus className="h-7 w-7 text-muted" />
                  <span className="text-sm text-muted">
                    Front side of your {idType === 'aadhaar' ? 'Aadhaar' : 'PAN'}
                  </span>
                </>
              }
            />

            <Field label={`Enter ${idType === 'aadhaar' ? 'Aadhaar' : 'PAN'} Number`} required>
              <input
                value={idNumber}
                onChange={(e) =>
                  setIdNumber(
                    idType === 'aadhaar'
                      ? e.target.value.replace(/\D/g, '').slice(0, 12)
                      : e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
                  )
                }
                inputMode={idType === 'aadhaar' ? 'numeric' : 'text'}
                placeholder={idType === 'aadhaar' ? '1234 5678 9012' : 'ABCDE1234F'}
                className={inputCls}
              />
            </Field>

            <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-green-light p-3.5">
              <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald" />
              <p className="text-xs leading-relaxed text-navy/80">
                <strong className="font-semibold">Demo build — do not enter a real ID number.</strong>{' '}
                Nothing is uploaded anywhere. Only the last 4 digits would be retained, so the review
                screen can show a masked reference.
              </p>
            </div>
          </StepShell>
        )}

        {step === 'review' && (
          <section className="pt-2">
            <div
              className={`mb-6 flex items-center gap-4 rounded-card p-5 ${
                verified ? 'bg-green-light' : 'bg-[#FDF0E2]'
              }`}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-navy">
                  {verified ? 'You are verified' : 'Documents under verification'}
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                  {verified
                    ? 'Your listings can go live now.'
                    : 'This may take up to 24 hours. Please wait!'}
                </p>
              </div>
              {verified ? (
                <BadgeCheck className="h-10 w-10 shrink-0 text-emerald" />
              ) : (
                <CircleAlert className="h-10 w-10 shrink-0 text-warn" />
              )}
            </div>

            <ul className="space-y-3">
              <DocRow label="Host account" status="verified" note="Created" />
              {DOCS.map((d) => (
                <DocRow key={d.id} label={d.label} status={docs[d.id]} />
              ))}
            </ul>

            {verified ? (
              <ButtonLink href="/host/earnings" size="lg" className="mt-8 w-full">
                Go to your dashboard
              </ButtonLink>
            ) : (
              <>
                <Button
                  size="lg"
                  className="mt-8 w-full"
                  onClick={() => setDocs(allDocs('verified'))}
                >
                  Approve now (demo)
                </Button>
                <p className="mt-2 text-center text-xs text-muted">
                  Stands in for the verification partner so a demo need not wait 24 hours.
                </p>
              </>
            )}

            <div className="mt-8 flex items-start gap-2.5 rounded-card border border-warn/30 bg-warn/5 p-4">
              <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-warn" />
              <p className="text-xs leading-relaxed text-navy/75">
                ChargeSetu verifies listing information, but verification does not replace
                professional electrical inspection. Only list sockets that meet applicable
                electrical safety requirements.{' '}
                <Link href="/safety" className="font-semibold text-emerald hover:underline">
                  Read the safety guidance
                </Link>
                .
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ bits */

const inputCls =
  'w-full rounded-lg border border-line bg-surface px-4 py-3 text-base text-navy outline-none placeholder:text-muted focus:border-emerald';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <label className="mb-2 block text-base font-semibold text-navy">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
    </div>
  );
}

function StepShell({
  heading,
  sub,
  children,
  onNext,
  nextDisabled,
  nextLabel = 'Continue',
  skip,
}: {
  heading: string;
  sub?: string;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  skip?: () => void;
}) {
  return (
    <section className="pt-2">
      {heading && <h2 className="text-3xl font-bold tracking-tight text-navy">{heading}</h2>}
      {sub && <p className="mt-2 text-muted">{sub}</p>}
      {children}
      <Button size="lg" className="mt-8 w-full" onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </Button>
      {skip && (
        <Button size="lg" variant="secondary" className="mt-3 w-full" onClick={skip}>
          Skip for now
        </Button>
      )}
    </section>
  );
}

function PhotoDrop({
  value,
  onChange,
  className = '',
  placeholder,
  asLink,
  label,
}: {
  value: string | null;
  onChange: (uri: string) => void;
  className?: string;
  placeholder?: React.ReactNode;
  asLink?: boolean;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const pick = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  const input = (
    <input
      ref={ref}
      type="file"
      accept="image/*"
      capture="user"
      className="sr-only"
      onChange={(e) => pick(e.target.files?.[0])}
    />
  );

  if (asLink) {
    return (
      <>
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="mt-2 text-[15px] font-semibold text-emerald hover:underline"
        >
          {label}
        </button>
        {input}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-card border-2 border-dashed border-line bg-surface ${className}`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          placeholder
        )}
      </button>
      {input}
    </>
  );
}

function DocRow({ label, status, note }: { label: string; status: DocStatus; note?: string }) {
  const ok = status === 'verified';
  return (
    <li className="card flex items-center gap-3.5 p-4">
      {ok ? (
        <BadgeCheck className="h-5.5 w-5.5 shrink-0 text-emerald" />
      ) : (
        <CircleAlert className="h-5.5 w-5.5 shrink-0 text-warn" />
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-navy">{label}</p>
        <p className={`text-sm ${ok ? 'text-emerald' : 'text-warn'}`}>
          {note ?? (ok ? 'Verified' : status === 'submitted' ? 'Under verification…' : 'Not submitted')}
        </p>
      </div>
    </li>
  );
}
