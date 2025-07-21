import React from 'react';
import SphereMask from '../ui/SphereMask';
import GoogleSvg from '../../imgs/Google.svg';
import GitHubSvg from '../../imgs/GitHub.svg';
import UberSvg from '../../imgs/Uber.svg';
import MicrosoftSvg from '../../imgs/Microsoft.svg';
import NotionSvg from '../../imgs/Notion.svg';

const ClientSection: React.FC = () => {
  const clients = [
    { name: 'Google', logo: GoogleSvg },
    { name: 'Microsoft', logo: MicrosoftSvg },
    { name: 'GitHub', logo: GitHubSvg },
    { name: 'Uber', logo: UberSvg },
    { name: 'Notion', logo: NotionSvg }
  ];

  return (
    <section id="clients" className="mx-auto max-w-7xl px-6 text-center md:px-8">
      <div className="py-14">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="text-center text-sm font-semibold text-gray-600">
            TRUSTED BY TEAMS FROM AROUND THE WORLD
          </h2>
          <div className="mt-6">
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
              {clients.map((client, index) => (
                <li key={index}>
                  <img
                    alt={client.name}
                    src={client.logo}
                    className="h-8 w-28 px-2 brightness-0 invert"
                    width={28}
                    height={8}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <SphereMask />
    </section>
  );
};

export default ClientSection;
