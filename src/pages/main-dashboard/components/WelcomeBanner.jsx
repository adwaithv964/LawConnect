import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeBanner = ({ userName = "User" }) => {
  const currentHour = new Date()?.getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="bg-gradient-to-r from-primary to-secondary p-6 md:p-8 lg:p-10 rounded-xl shadow-elevation-3 text-primary-foreground">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold mb-2">
            {greeting}, {userName}!
          </h1>
          <p className="text-sm md:text-base lg:text-lg opacity-90 max-measure">
            Welcome to LawConnect - Your trusted legal assistance platform. Access AI-powered guidance, manage your cases, and get immediate support whenever you need it.
          </p>
        </div>
        <div className="hidden lg:flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
          <Icon name="Scale" size={32} color="currentColor" />
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
          <Icon name="CheckCircle" size={18} color="currentColor" />
          <span className="text-sm font-medium">Verified Platform</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
          <Icon name="Shield" size={18} color="currentColor" />
          <span className="text-sm font-medium">Secure & Private</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
          <Icon name="Clock" size={18} color="currentColor" />
          <span className="text-sm font-medium">24/7 Available</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;