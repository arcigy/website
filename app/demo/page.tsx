import AnimatedShaderHero from '@/components/ui/animated-shader-hero';

export const metadata = {
  title: 'Animated Shader Hero — Demo | Arcigy',
  description: 'Live preview of the AnimatedShaderHero component with WebGL2 fractal-noise background.',
};

export default function ShaderHeroDemoPage() {
  return (
    <main>
      <AnimatedShaderHero
        trustBadge={{
          text: 'Trusted by forward-thinking teams.',
          icons: ['✨'],
        }}
        headline={{
          line1: 'Launch Your',
          line2: 'Workflow Into Orbit',
        }}
        subtitle="Supercharge productivity with AI-powered automation and integrations built for the next generation of teams — fast, seamless, and limitless."
        buttons={{
          primary: { text: 'Get Started for Free' },
          secondary: { text: 'Explore Features' },
        }}
      />

      {/* Usage reference — visible below the hero */}
      <section className="bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            How to Use the Hero Component
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <pre className="text-sm text-gray-600 overflow-x-auto whitespace-pre-wrap">
{`import AnimatedShaderHero from '@/components/ui/animated-shader-hero';

<AnimatedShaderHero
  trustBadge={{ text: "Your trust badge", icons: ["🚀"] }}
  headline={{ line1: "Your First Line", line2: "Your Second Line" }}
  subtitle="Your compelling subtitle..."
  buttons={{
    primary:   { text: "Primary CTA",   onClick: handlePrimary },
    secondary: { text: "Secondary CTA", onClick: handleSecondary },
  }}
  className="optional-extra-classes"
/>`}
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
