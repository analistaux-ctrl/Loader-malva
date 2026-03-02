import React, { useState } from 'react';
import { Check, Copy, Moon, Sun, Code2 } from 'lucide-react';
import { svgPaths } from './SvgPaths';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const handleCopy = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const htmlCode = `<div id="luxury-global-loader" class="luxury-loader-overlay">
  <div class="luxury-loader-container">
    <svg class="luxury-loader-svg-custom" width="121" height="58" viewBox="0 0 121 58" fill="none" xmlns="http://www.w3.org/2000/svg">
${svgPaths.map(path => `      <path class="luxury-custom-path" pathLength="100" d="${path}" />`).join('\n')}
    </svg>
  </div>
</div>`;

  const cssCode = `/* Añadir a assets/base.css o theme.css */
.luxury-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff; /* Cambiar a #000000 para tema oscuro */
  color: #1a1a1a; /* Cambiar a #ffffff para tema oscuro */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s;
}

.luxury-loader-overlay.loader-hidden {
  opacity: 0;
  visibility: hidden;
}

.luxury-loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.luxury-loader-svg-custom {
  width: 121px;
  height: auto;
  animation: luxury-float 4s ease-in-out infinite;
}

.luxury-custom-path {
  fill: transparent;
  stroke: currentColor;
  stroke-width: 0.5;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: luxury-draw-fill 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

${svgPaths.map((_, i) => `.luxury-custom-path:nth-child(${i + 1}) { animation-delay: ${(i * 0.05).toFixed(2)}s; }`).join('\n')}

@keyframes luxury-draw-fill {
  0% {
    stroke-dashoffset: 100;
    fill: transparent;
  }
  30% {
    stroke-dashoffset: 0;
    fill: transparent;
  }
  50%, 80% {
    stroke-dashoffset: 0;
    fill: currentColor;
  }
  100% {
    stroke-dashoffset: 100;
    fill: transparent;
  }
}

@keyframes luxury-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}`;

  const jsCode = `// Añadir al final de layout/theme.liquid antes de </body>
<script>
  document.addEventListener("DOMContentLoaded", function() {
    // Ocultar el loader cuando la página haya cargado completamente
    window.addEventListener("load", function() {
      var loader = document.getElementById("luxury-global-loader");
      if (loader) {
        // Pequeño retraso opcional para asegurar que la animación se vea
        setTimeout(function() {
          loader.classList.add("loader-hidden");
        }, 500);
      }
    });

    // Opcional: Mostrar el loader al hacer clic en enlaces internos
    document.querySelectorAll('a[href^="/"]').forEach(function(anchor) {
      anchor.addEventListener("click", function(e) {
        // Ignorar enlaces que abren en nueva pestaña o anclas
        if (this.target === "_blank" || this.getAttribute("href").startsWith("#")) return;
        
        var loader = document.getElementById("luxury-global-loader");
        if (loader) {
          loader.classList.remove("loader-hidden");
        }
      });
    });
  });
</script>`;

  const liquidCode = `{% comment %}
  Guarda este código en snippets/luxury-loader.liquid
  Y luego inclúyelo en layout/theme.liquid justo después de la etiqueta <body>:
  {% render 'luxury-loader' %}
{% endcomment %}

<style>
  /* Aquí va el CSS (puedes moverlo a tu archivo base.css si lo prefieres) */
  ${cssCode.replace('/* Añadir a assets/base.css o theme.css */\n', '')}
</style>

${htmlCode}

${jsCode}`;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col lg:flex-row font-sans">
      {/* Left Panel: Preview */}
      <div className={`flex-1 relative flex flex-col items-center justify-center min-h-[50vh] lg:min-h-screen transition-colors duration-700 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-white text-[#1a1a1a]'}`}>
        <div className="absolute top-6 right-6 flex gap-2">
          <button 
            onClick={() => setTheme('light')}
            className={`p-2.5 rounded-full transition-colors ${theme === 'light' ? 'bg-neutral-100' : 'hover:bg-neutral-900'}`}
            aria-label="Modo Claro"
          >
            <Sun size={18} className={theme === 'light' ? 'text-neutral-900' : 'text-neutral-400'} />
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={`p-2.5 rounded-full transition-colors ${theme === 'dark' ? 'bg-neutral-900' : 'hover:bg-neutral-100'}`}
            aria-label="Modo Oscuro"
          >
            <Moon size={18} className={theme === 'dark' ? 'text-white' : 'text-neutral-500'} />
          </button>
        </div>

        {/* The Loader Preview */}
        <div className="flex flex-col items-center gap-8">
          <svg className="w-[121px] h-auto animate-[luxury-float_4s_ease-in-out_infinite]" viewBox="0 0 121 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            {svgPaths.map((path, i) => (
              <path 
                key={i}
                className="animate-[luxury-draw-fill_3s_cubic-bezier(0.4,0,0.2,1)_infinite]" 
                style={{ 
                  strokeDasharray: 100, 
                  strokeDashoffset: 100,
                  animationDelay: `${(i * 0.05).toFixed(2)}s`,
                  fill: 'transparent',
                  stroke: 'currentColor',
                  strokeWidth: 0.5
                }}
                pathLength="100" 
                d={path} 
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Right Panel: Code */}
      <div className="flex-1 bg-neutral-50 border-l border-neutral-200 overflow-y-auto h-screen p-6 lg:p-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-neutral-900 text-white rounded-lg">
              <Code2 size={20} />
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-neutral-900">Loader de Lujo para Shopify</h1>
          </div>
          <p className="text-neutral-500 text-[15px] mb-10 leading-relaxed">
            Una animación de carga elegante y minimalista. Copia este código e inclúyelo en tu tema de Shopify (Liquid) para mejorar la experiencia de usuario durante la carga de páginas.
          </p>

          <div className="space-y-12">
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-medium text-neutral-900">Opción 1: Todo en un archivo (Recomendado)</h2>
                <p className="text-sm text-neutral-500 mt-1">Crea un archivo <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-neutral-700">snippets/luxury-loader.liquid</code> y pega este código.</p>
              </div>
              <CodeBlock code={liquidCode} id="liquid" copiedTab={copiedTab} onCopy={handleCopy} />
            </div>
            
            <div className="pt-8 border-t border-neutral-200">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-neutral-900">Opción 2: Archivos separados</h2>
                <p className="text-sm text-neutral-500 mt-1">Si prefieres mantener tu HTML, CSS y JS en sus respectivos archivos.</p>
              </div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-medium text-neutral-700 mb-3">1. HTML (layout/theme.liquid)</h3>
                  <CodeBlock code={htmlCode} id="html" copiedTab={copiedTab} onCopy={handleCopy} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-700 mb-3">2. CSS (assets/base.css)</h3>
                  <CodeBlock code={cssCode} id="css" copiedTab={copiedTab} onCopy={handleCopy} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-700 mb-3">3. JavaScript (layout/theme.liquid)</h3>
                  <CodeBlock code={jsCode} id="js" copiedTab={copiedTab} onCopy={handleCopy} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ code, id, copiedTab, onCopy }: { code: string, id: string, copiedTab: string | null, onCopy: (code: string, id: string) => void }) {
  return (
    <div className="relative group">
      <div className="absolute right-3 top-3 z-10">
        <button 
          onClick={() => onCopy(code, id)}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-md"
        >
          {copiedTab === id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          {copiedTab === id ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre className="bg-[#111111] text-neutral-300 p-5 rounded-xl overflow-x-auto text-[13px] leading-relaxed font-mono shadow-inner border border-neutral-800">
        <code>{code}</code>
      </pre>
    </div>
  );
}
