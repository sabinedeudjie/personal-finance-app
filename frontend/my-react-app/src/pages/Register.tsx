import React, { useState } from 'react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Vide', color: 'bg-gray-800', text: 'text-gray-500' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Faible', color: 'bg-red-500', text: 'text-red-500' };
    if (score <= 4) return { score, label: 'Moyen', color: 'bg-amber-500', text: 'text-amber-500' };
    return { score, label: 'Excellent', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Inscription avec :', { name, email, password });
  };

  return (
    <div className="min-h-screen bg-[#040608] text-gray-100 flex font-sans">
      {/* Panneau gauche - Avantages exclusifs */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#080B10] p-12 flex-col justify-between overflow-hidden border-r border-gray-800">
        {/* Halos de lumière en arrière-plan */}
        <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Logo (Épuré sans icône) */}
        <div className="relative z-10 flex items-center gap-2 text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Finova
        </div>

        {/* Liste des avantages */}
        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Vos avantages exclusifs
          </h1>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1">✓</span>
              <p className="text-gray-400">Tableau de bord intelligent mis à jour en temps réel.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1">✓</span>
              <p className="text-gray-400">Analyses avancées et prévisions budgétaires automatisées.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1">✓</span>
              <p className="text-gray-400">Sécurité de bout en bout et protocoles de chiffrement renforcés.</p>
            </div>
          </div>
        </div>

        {/* Footer panneau */}
        <div className="relative z-10 text-xs text-gray-600">
          &copy; 2026 Finova Inc. Tous droits réservés.
        </div>
      </div>

      {/* Panneau droit - Formulaire d'inscription */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 bg-[#040608]">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Créer un compte</h2>
            <p className="mt-2 text-sm text-gray-400">Rejoignez notre plateforme de gestion financière nouvelle génération</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-4">
              {/* Nom Complet */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Nom complet
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#090D14] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#090D14] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
                  placeholder="john@exemple.com"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#090D14] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? 'Masquer' : 'Afficher'}
                  </button>
                </div>

                {/* Indicateur visuel dynamique de sécurité */}
                {password && (
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-500">Sécurité du mot de passe :</span>
                      <span className={strength.text}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${strength.color} transition-all duration-300`} 
                        style={{ width: `${(strength.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bouton de validation */}
            <button
              type="submit"
              className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-semibold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-200 flex items-center justify-center gap-2"
            >
              Créer mon compte
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Déjà inscrit ?{' '}
            <a href="#" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
