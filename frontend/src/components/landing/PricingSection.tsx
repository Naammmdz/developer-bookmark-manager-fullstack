import React, { useState } from 'react';
import { Check, Loader } from 'lucide-react';
import { cn } from '../../lib/utils';

type Interval = 'month' | 'year';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  monthlyPrice: number;
  yearlyPrice: number;
  isMostPopular: boolean;
}

const PricingSection: React.FC = () => {
  const [interval, setInterval] = useState<Interval>('month');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState('');

  const toHumanPrice = (price: number, decimals: number = 2) => {
    return Number(price / 100).toFixed(decimals);
  };

  const productPrices: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for individual developers getting started',
      features: [
        'Up to 100 bookmarks',
        'Basic search & filtering',
        '3 collections',
        'Export bookmarks'
      ],
      monthlyPrice: 0,
      yearlyPrice: 0,
      isMostPopular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For professional developers who need more power',
      features: [
        'Unlimited bookmarks',
        'Advanced search & AI tags',
        'Unlimited collections',
        'Team collaboration',
        'Priority support',
        'Custom themes'
      ],
      monthlyPrice: 999,
      yearlyPrice: 9990,
      isMostPopular: true
    },
    {
      id: 'team',
      name: 'Team',
      description: 'For development teams and organizations',
      features: [
        'Everything in Pro',
        'Team workspaces',
        'Admin controls',
        'SSO integration',
        'API access',
        'Analytics dashboard'
      ],
      monthlyPrice: 2999,
      yearlyPrice: 29990,
      isMostPopular: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      features: [
        'Everything in Team',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'On-premise deployment',
        'Custom training'
      ],
      monthlyPrice: 9999,
      yearlyPrice: 99990,
      isMostPopular: false
    }
  ];

  const onSubscribeClick = async (priceId: string) => {
    setLoadingIndex(priceId);
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setLoadingIndex('');
  };

  return (
    <section id="pricing">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-4 py-14 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h4 className="text-xl font-bold tracking-tight text-white">Pricing</h4>
          <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Simple pricing for everyone.
          </h2>
          <p className="mt-6 text-xl leading-8 text-white/80">
            Choose an <strong>affordable plan</strong> that's packed with the best features for organizing your development resources and boosting your productivity.
          </p>
        </div>

        <div className="flex w-full items-center justify-center space-x-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={interval === 'year'}
              onChange={(e) => setInterval(e.target.checked ? 'year' : 'month')}
              className="sr-only"
            />
            <div className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              interval === 'year' ? "bg-primary" : "bg-gray-600"
            )}>
              <span className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                interval === 'year' ? "translate-x-6" : "translate-x-1"
              )} />
            </div>
            <span className="text-white">Annual</span>
          </label>
          <span className="inline-block whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase leading-5 tracking-wide text-black">
            2 MONTHS FREE ✨
          </span>
        </div>

        <div className="mx-auto grid w-full flex-col justify-center gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productPrices.map((price, index) => (
            <div
              key={price.id}
              className={cn(
                'relative flex max-w-[400px] flex-col gap-8 overflow-hidden rounded-2xl border p-4 text-white',
                {
                  'border-2 border-primary': price.isMostPopular,
                  'border-white/20': !price.isMostPopular
                }
              )}
            >
              <div className="flex items-center">
                <div className="ml-4">
                  <h2 className="text-base font-semibold leading-7">
                    {price.name}
                  </h2>
                  <p className="h-12 text-sm leading-5 text-white/70">
                    {price.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-row gap-1">
                <span className="text-4xl font-bold text-white">
                  {price.monthlyPrice === 0 ? 'Free' : (
                    <>
                      ${interval === 'month' 
                        ? toHumanPrice(price.monthlyPrice, 0) 
                        : toHumanPrice(price.yearlyPrice, 0)
                      }
                      <span className="text-xs">
                        {price.monthlyPrice > 0 && ` / ${interval}`}
                      </span>
                    </>
                  )}
                </span>
              </div>

              <button
                className={cn(
                  'group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter py-3 px-6 rounded-lg',
                  'transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2',
                  price.isMostPopular 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                )}
                disabled={isLoading}
                onClick={() => onSubscribeClick(price.id)}
              >
                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform-gpu bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-96" />
                {isLoading && loadingIndex === price.id ? (
                  <>
                    <Loader className="mr-2 size-4 animate-spin inline" />
                    Subscribing
                  </>
                ) : (
                  price.monthlyPrice === 0 ? 'Get Started' : 'Subscribe'
                )}
              </button>

              <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-200/0 via-neutral-500/30 to-neutral-200/0" />

              {price.features && price.features.length > 0 && (
                <ul className="flex flex-col gap-2 font-normal">
                  {price.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs font-medium text-white">
                      <Check className="size-5 shrink-0 rounded-full bg-green-400 p-[2px] text-black" />
                      <span className="flex">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
