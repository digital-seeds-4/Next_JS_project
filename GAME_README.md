# 🎮 Jeu Interactif de Préincubation

Un jeu éducatif complet pour valider la maturité d'un projet entrepreneurial. Conçu pour être facilement intégrable dans n'importe quel projet React/Next.js.

## 📋 Caractéristiques

✅ **6 phases pédagogiques** pour structurer votre idée entrepreneuriale  
✅ **Questions à conséquences** avec feedback automatique  
✅ **Score de maturité** calculé dynamiquement  
✅ **Génération de dossier projet** au format JSON  
✅ **Animations fluides** et design moderne  
✅ **Responsive** - Fonctionne sur mobile, tablette et desktop  
✅ **Sans dépendances externes** - Utilise uniquement React et CSS natif  
✅ **Copier-coller ready** - Compatible JSX et TSX  

## 🎯 Les 6 Phases du Jeu

1. **Clarification de l'idée** - Définissez le problème, la solution et votre cible
2. **Étude de marché simulée** - Analysez votre marché et la concurrence
3. **Choix du business model** - Définissez vos revenus et coûts
4. **Construction de l'offre** - Structurez votre proposition de valeur
5. **Prototypage et tests** - Validez avec vos utilisateurs
6. **Pré-pitch et validation** - Obtenez un score de maturité

## 🚀 Installation

### 1. Copier les fichiers

Placez les fichiers suivants dans votre projet:
- `PreIncubationGame.tsx` → `/app/components/`
- `PreIncubationGame.css` → `/app/components/`

### 2. Importer le composant

```jsx
import PreIncubationGame from '@/app/components/PreIncubationGame';

export default function MyPage() {
  return <PreIncubationGame />;
}
```

### 3. Utiliser dans Next.js

Créez une nouvelle page:

```bash
mkdir app/game
```

Puis créez `app/game/page.tsx`:

```tsx
import PreIncubationGame from '@/app/components/PreIncubationGame';

export default function GamingPage() {
  return (
    <main>
      <PreIncubationGame />
    </main>
  );
}
```

Accédez à `http://localhost:3000/game`

## 📱 Utilisation dans un projet React classique

Si vous n'utilisez pas Next.js, le composant fonctionne aussi avec Create React App:

```jsx
import React from 'react';
import PreIncubationGame from './components/PreIncubationGame';
import './components/PreIncubationGame.css';

function App() {
  return (
    <div className="App">
      <PreIncubationGame />
    </div>
  );
}

export default App;
```

## 🎨 Structure du Composant

```
PreIncubationGame
├── Écran de démarrage (Entrée du nom et du projet)
├── Boucle de jeu
│   ├── Affichage de la phase
│   ├── Questions avec options
│   ├── Feedback pédagogique
│   └── Navigation
└── Écran de résultats
    ├── Score de maturité
    ├── Scores par phase
    ├── Résumé du projet
    └── Téléchargement du dossier
```

## 📊 Données Générées

À la fin du jeu, un dossier projet JSON est généré avec:

```json
{
  "projectName": "MyStartup",
  "userName": "Marie Dupont",
  "createdAt": "31/01/2026",
  "maturityScore": 85,
  "phaseScores": {
    "1": 185,
    "2": 175,
    "3": 180,
    "4": 190,
    "5": 185,
    "6": 190
  },
  "totalScore": 1105,
  "maxScore": 1200
}
```

## 🎬 Animations Incluses

- ✨ **Fade in** - Apparition progressive
- 🚀 **Slide up** - Glissement vers le haut
- 🔄 **Bounce** - Rebond du titre
- 📈 **Animations de progression** - Barre de progression fluidement animée
- 🎯 **Hover effects** - Interactions visuelles fluides

## 🛠️ Personnalisation

### Modifier les questions

Éditez l'array `GAME_PHASES` dans `PreIncubationGame.tsx`:

```tsx
const GAME_PHASES: GamePhase[] = [
  {
    id: 1,
    title: 'Votre phase',
    subtitle: 'Sous-titre',
    description: 'Description',
    questions: [
      {
        id: 'question_id',
        text: 'Votre question?',
        options: [
          {
            id: 'opt1',
            text: 'Option 1',
            value: 100,
            consequences: 'Conséquence positive'
          },
          // ... plus d'options
        ],
        feedback: 'Feedback pédagogique'
      }
    ]
  }
];
```

### Modifier les couleurs

Changez le gradient principal dans `PreIncubationGame.css`:

```css
.game-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Modifier les animations

Ajustez les animations CSS:

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px); /* Changez 30px */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## 📦 Compatibilité

- ✅ React 16.8+
- ✅ Next.js 12+
- ✅ TypeScript/JavaScript
- ✅ Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS, Android)

## 🚫 Dépendances

**Aucune dépendance externe!**
- Utilise uniquement React (déjà dans votre projet)
- CSS natif (sans Tailwind, Bootstrap, etc.)
- Compatible avec tout framework CSS

## 💡 Conseils d'Utilisation

1. **Intégrez le jeu dans votre onboarding** - Faites découvrir votre plateforme
2. **Utilisez les données générées** - Créez des profils utilisateurs enrichis
3. **Personnalisez les questions** - Adaptez aux spécificités de votre marché
4. **Analysez les résultats** - Comprenez la maturité de vos utilisateurs
5. **Gamifiez votre plateforme** - Ajoutez des badges ou des récompenses

## 🔐 Notes de Sécurité

- Le jeu fonctionne entièrement côté client
- Aucune donnée n'est envoyée à un serveur
- Les données sont téléchargées en JSON côté client
- Vous pouvez implémenter votre propre backend pour sauvegarder les données

## 📈 Métriques de Scoring

Le score de maturité est calculé sur:
- **Maximum 200 points par phase** (2 questions × 100 points)
- **Score total: 1200 points** (6 phases)
- **Pourcentage final: (score total / 1200) × 100**

### Interprétation des scores

- 🌟 **80-100%** - Excellent! Projet très mature
- ✨ **60-79%** - Bon travail! Quelques points à affiner
- ⚠️ **40-59%** - Des efforts à faire pour améliorer
- 📚 **0-39%** - À approfondir, continuez les validations

## 🎓 Cas d'Usage

✅ Plateforme d'incubation de startups  
✅ Formation entrepreneuriale  
✅ Prédéfinition d'idées de projets  
✅ Outil de diagnostic pour mentors  
✅ Gamification d'une plateforme innovation  
✅ Quiz éducatif interactif  

## 🐛 Troubleshooting

### Le composant n'affiche rien
- Vérifiez que les fichiers `.tsx` et `.css` sont dans le même dossier
- Assurez-vous que le CSS est bien importé

### Les animations sautent
- Vérifiez que le CSS n'est pas en conflit avec d'autres styles
- Testez dans un contexte isolé d'abord

### Le fichier JSON ne se télécharge pas
- Vérifiez que votre navigateur permet les téléchargements
- Vérifiez les permissions du navigateur

## 📞 Support

Pour des questions ou des modifications, tous les éléments du composant sont commentés et faciles à comprendre.

## 📄 Licence

Libre d'utilisation - Vous pouvez utiliser, modifier et distribuer ce code librement.

---

**Bon jeu! 🎮✨**
