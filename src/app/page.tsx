'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Shop } from '@/types';
import { getPublishedShops } from '@/lib/firebase/firestore';

export default function HomePage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    const { shops } = await getPublishedShops(12);
    setShops(shops);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Create Beautiful Business Pages in Minutes
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Professional business listing platform with analytics, reviews, and advanced SEO features.
              Perfect for local businesses in Kashmir.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/pricing"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose KashPages?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Easy Setup"
              description="Create your business page in just 3 simple steps. No coding required."
              icon="⚡"
            />
            <FeatureCard
              title="Advanced Analytics"
              description="Track views, clicks, and engagement with detailed analytics dashboard."
              icon="📊"
            />
            <FeatureCard
              title="Customer Reviews"
              description="Collect and manage customer reviews to build trust and credibility."
              icon="⭐"
            />
            <FeatureCard
              title="SEO Optimized"
              description="Built-in SEO features to help your business rank higher in search results."
              icon="🔍"
            />
            <FeatureCard
              title="Mobile Friendly"
              description="Your business page looks perfect on all devices automatically."
              icon="📱"
            />
            <FeatureCard
              title="Affordable Plans"
              description="Start free, upgrade to Pro for just ₹50/month with advanced features."
              icon="💰"
            />
          </div>
        </div>
      </section>

      {/* Published Shops Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Businesses</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : shops.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <Link key={shop.id} href={`/shop/${shop.slug}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <img
                      src={shop.coverImage}
                      alt={shop.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{shop.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{shop.about}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No businesses listed yet.</p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join hundreds of businesses already using KashPages
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">KashPages</h3>
              <p className="text-sm">Professional business listing platform for Kashmir</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/features">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 KashPages. All rights reserved. Built with ❤️ in Kashmir</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
