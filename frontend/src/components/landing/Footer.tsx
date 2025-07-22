import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import DiscordSvg from '../../imgs/discord.svg';
import TwitterSvg from '../../imgs/x.svg';
import GithubSvg from '../../imgs/github-dark.svg';
import Logo from '../../imgs/Logo.png';

const Footer: React.FC = () => {
  const footerNavs = [
    {
      label: 'Product',
      items: [
        {
          href: '/',
          name: 'DevPin'
        },
        {
          href: '#pricing',
          name: 'Pricing'
        },
        {
          href: '/faq',
          name: 'FAQ'
        }
      ]
    },
    {
      label: 'Community',
      items: [
        {
          href: '/',
          name: 'Github'
        },
        {
          href: '/',
          name: 'Twitter'
        },
        {
          href: 'mailto:hello@devpin.com',
          name: 'Email'
        }
      ]
    },
    {
      label: 'Legal',
      items: [
        {
          href: '/terms',
          name: 'Terms'
        },
        {
          href: '/privacy',
          name: 'Privacy'
        }
      ]
    }
  ];

  const footerSocials = [
    {
      href: '#',
      name: 'Discord',
      icon: DiscordSvg
    },
    {
      href: '#',
      name: 'Github',
      icon: GithubSvg
    },
    {
      href: '#',
      name: 'Twitter',
      icon: TwitterSvg
    }
  ];

  return (
    <footer>
      <div className="mx-auto w-full max-w-screen-xl xl:pb-2">
        <div className="gap-4 p-4 px-8 py-16 sm:pb-16 md:flex md:justify-between">
          <div className="mb-12 flex flex-col gap-4">
            <Link to="/landing" className="flex items-center gap-2">
              <img src={Logo} alt="DevPin" className="h-8 w-auto" />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                DevPin
              </span>
            </Link>
            <p className="max-w-xs">Resource Manager for Developers</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
            {footerNavs.map((nav, index) => (
              <div key={index}>
                <h2 className="mb-6 text-sm font-medium uppercase tracking-tighter text-white">
                  {nav.label}
                </h2>
                <ul className="grid gap-2">
                  {nav.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <a
                        href={item.href}
                        className="cursor-pointer text-sm font-[450] text-gray-400 duration-200 hover:text-gray-200"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-md border-neutral-700/20 px-8 py-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-5 sm:mt-0 sm:justify-center">
            {footerSocials.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="fill-gray-500 text-gray-500 hover:fill-gray-900 hover:text-gray-900 dark:hover:fill-gray-600 dark:hover:text-gray-600"
              >
                <img src={social.icon} className="size-4" alt={social.name} />
                <span className="sr-only">{social.name}</span>
              </a>
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
            Copyright ©{' '}
            {new Date().getFullYear()}{' '}
            <a href="/" className="cursor-pointer">DevPin</a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
