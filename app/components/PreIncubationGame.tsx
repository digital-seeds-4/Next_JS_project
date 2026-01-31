'use client';

import React, { useState, useEffect } from 'react';
import './PreIncubationGame.css';

interface GamePhase {
  id: number;
  title: string;
  subtitle: string;
  questions: Question[];
  description: string;
  emoji: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  feedback: string;
}

interface Option {
  id: string;
  text: string;
  value: number;
  consequences: string;
}

interface GameState {
  currentPhase: number;
  currentQuestion: number;
  answers: Record<string, string>;
  scores: Record<number, number>;
  projectData: Record<string, any>;
  isComplete: boolean;
  characterExpression: 'neutral' | 'happy' | 'excited' | 'thinking' | 'celebrate';
  submittedAt?: string;
  evaluationStatus?: 'pending' | 'evaluated' | 'approved' | 'rejected';
}

interface Particle {
  id: string;
  x: number;
  y: number;
}

const GAME_PHASES: GamePhase[] = [
  {
    id: 1,
    title: 'Clarification de l\'idée',
    subtitle: 'Définissez le cœur de votre projet',
    emoji: '💡',
    description: 'Structurez votre idée autour du problème, de la solution, de votre cible et de votre différenciation.',
    questions: [
      {
        id: 'phase1_problem',
        text: 'Quel problème majeur votre solution résout-elle?',
        options: [
          {
            id: 'p1_opt1',
            text: 'Un problème bien défini et validé par des utilisateurs',
            value: 100,
            consequences: 'Excellent! Vous avez une base solide pour votre projet.',
          },
          {
            id: 'p1_opt2',
            text: 'Un problème supposé mais pas encore validé',
            value: 70,
            consequences: 'Bon point de départ. Pensez à valider avec vos futurs utilisateurs.',
          },
          {
            id: 'p1_opt3',
            text: 'Vous n\'êtes pas sûr du problème exact',
            value: 40,
            consequences: 'C\'est normal! Prenez le temps de bien identifier le problème avant de continuer.',
          },
        ],
        feedback: 'La clarté du problème est cruciale pour le succès de votre projet.',
      },
      {
        id: 'phase1_target',
        text: 'Qui est votre utilisateur cible principal?',
        options: [
          {
            id: 'p1_opt4',
            text: 'Un segment spécifique et bien défini',
            value: 100,
            consequences: 'Parfait! Vous avez une cible claire.',
          },
          {
            id: 'p1_opt5',
            text: 'Plusieurs segments potentiels',
            value: 60,
            consequences: 'À raffiner. Focalisez-vous sur un segment prioritaire.',
          },
          {
            id: 'p1_opt6',
            text: '"Tout le monde" ou très large',
            value: 30,
            consequences: 'Trop large! Affinez votre segmentation pour mieux cibler.',
          },
        ],
        feedback: 'Concentrez-vous sur un segment prioritaire pour commencer.',
      },
    ],
  },
  {
    id: 2,
    title: 'Étude de marché simulée',
    subtitle: 'Analysez votre environnement concurrentiel',
    emoji: '📊',
    description: 'Étudiez les segments de marché, la concurrence et les tendances pertinentes.',
    questions: [
      {
        id: 'phase2_market',
        text: 'Quel est le potentiel de marché estimé?',
        options: [
          {
            id: 'p2_opt1',
            text: 'Marché croissant avec forte demande identifiée',
            value: 100,
            consequences: 'Vous visez un marché porteur! C\'est un excellent signal.',
          },
          {
            id: 'p2_opt2',
            text: 'Marché stable avec demande modérée',
            value: 75,
            consequences: 'Le marché existe mais vous devrez être créatif pour vous différencier.',
          },
          {
            id: 'p2_opt3',
            text: 'Marché de niche avec demande très faible',
            value: 45,
            consequences: 'Viabilité à vérifier. Cherchez les micro-marchés connexes.',
          },
        ],
        feedback: 'Un marché en croissance offre de meilleures opportunités de développement.',
      },
      {
        id: 'phase2_competition',
        text: 'Comment êtes-vous différencié face à la concurrence?',
        options: [
          {
            id: 'p2_opt4',
            text: 'Différenciation claire et difficilement copiable',
            value: 100,
            consequences: 'Excellent avantage compétitif! Protégez bien votre innovation.',
          },
          {
            id: 'p2_opt5',
            text: 'Légers avantages sur quelques critères',
            value: 65,
            consequences: 'À renforcer. Travaillez votre positionnement.',
          },
          {
            id: 'p2_opt6',
            text: 'Pas de différenciation majeure identifiée',
            value: 30,
            consequences: 'C\'est le moment d\'innover! Trouvez votre angle unique.',
          },
        ],
        feedback: 'Votre différenciation est votre meilleur atout sur le marché.',
      },
    ],
  },
  {
    id: 3,
    title: 'Choix du business model',
    subtitle: 'Définissez votre modèle économique',
    emoji: '💰',
    description: 'Choisissez le modèle le plus adapté à votre offre et estimez les revenus et coûts.',
    questions: [
      {
        id: 'phase3_model',
        text: 'Quel business model avez-vous choisi?',
        options: [
          {
            id: 'p3_opt1',
            text: 'B2B SaaS avec abonnement récurrent',
            value: 90,
            consequences: 'Excellent choix pour la scalabilité et la prévisibilité des revenus.',
          },
          {
            id: 'p3_opt2',
            text: 'B2C avec vente unique ou freemium',
            value: 75,
            consequences: 'Modèle viable. Attention aux coûts d\'acquisition client.',
          },
          {
            id: 'p3_opt3',
            text: 'Marketplace ou commission',
            value: 70,
            consequences: 'Modèle intéressant si vous avez suffisamment d\'utilisateurs.',
          },
        ],
        feedback: 'Le business model doit être aligné avec vos coûts et vos utilisateurs.',
      },
      {
        id: 'phase3_unit_economics',
        text: 'Avez-vous étudié vos unit economics?',
        options: [
          {
            id: 'p3_opt4',
            text: 'Oui, coûts et revenus par client estimés',
            value: 95,
            consequences: 'Très bon! Vous avez une vision claire de votre rentabilité.',
          },
          {
            id: 'p3_opt5',
            text: 'Partiellement, quelques éléments estimés',
            value: 60,
            consequences: 'À approfondir. Modélisez mieux vos coûts et revenus.',
          },
          {
            id: 'p3_opt6',
            text: 'Pas encore étudié en détail',
            value: 30,
            consequences: 'Priorité! Faites une analyse complète avant de vous engager.',
          },
        ],
        feedback: 'Les unit economics sont essentielles pour prouver la viabilité de votre modèle.',
      },
    ],
  },
  {
    id: 4,
    title: 'Construction de l\'offre',
    subtitle: 'Développez votre proposition de valeur',
    emoji: '🎁',
    description: 'Définissez clairement ce que vous offrez et comment vous créez de la valeur.',
    questions: [
      {
        id: 'phase4_value',
        text: 'Pouvez-vous exprimer votre proposition de valeur en 1-2 phrases?',
        options: [
          {
            id: 'p4_opt1',
            text: 'Oui, clairement et persuasive',
            value: 100,
            consequences: 'Parfait! Vous savez vendre votre solution.',
          },
          {
            id: 'p4_opt2',
            text: 'Partiellement, mais c\'est un peu confus',
            value: 60,
            consequences: 'À clarifier. Simplifiez votre message.',
          },
          {
            id: 'p4_opt3',
            text: 'Non, difficile à synthétiser',
            value: 30,
            consequences: 'Il faut vraiment affiner votre positionnement.',
          },
        ],
        feedback: 'Une proposition de valeur claire est essentielle pour attirer vos premiers clients.',
      },
      {
        id: 'phase4_product',
        text: 'Avez-vous défini les features MVPs (Minimum Viable Product)?',
        options: [
          {
            id: 'p4_opt4',
            text: 'Oui, liste précise des features essentielles',
            value: 100,
            consequences: 'Excellent! Vous pouvez commencer le développement rapidement.',
          },
          {
            id: 'p4_opt5',
            text: 'Partiellement, liste trop longue',
            value: 65,
            consequences: 'À affiner. Supprimez les features non essentielles.',
          },
          {
            id: 'p4_opt6',
            text: 'Non, trop de features envisagées',
            value: 35,
            consequences: 'Définissez un MVP! C\'est crucial pour un lancement rapide.',
          },
        ],
        feedback: 'Le MVP doit être minimal mais viable pour tester votre hypothèse.',
      },
    ],
  },
  {
    id: 5,
    title: 'Prototypage et tests',
    subtitle: 'Validez vos hypothèses par le test',
    emoji: '🧪',
    description: 'Créez un prototype, testez avec vos utilisateurs et ajustez en fonction des retours.',
    questions: [
      {
        id: 'phase5_prototype',
        text: 'Quel niveau de prototype avez-vous atteint?',
        options: [
          {
            id: 'p5_opt1',
            text: 'MVP fonctionnel testé avec les utilisateurs',
            value: 100,
            consequences: 'Excellent! Vous avez validé votre solution avec des vrais utilisateurs.',
          },
          {
            id: 'p5_opt2',
            text: 'Prototype fonctionnel mais pas encore testé',
            value: 75,
            consequences: 'Prochaine étape: testez avec vos utilisateurs!',
          },
          {
            id: 'p5_opt3',
            text: 'Mock-ups ou wireframes uniquement',
            value: 50,
            consequences: 'C\'est un bon début. Créez un prototype fonctionnel rapidement.',
          },
        ],
        feedback: 'Les tests utilisateurs sont essentiels pour valider votre approche.',
      },
      {
        id: 'phase5_feedback',
        text: 'Avez-vous reçu du feedback utilisateur positif?',
        options: [
          {
            id: 'p5_opt4',
            text: 'Oui, feedback très positif et demandes claires',
            value: 100,
            consequences: 'Super! Vous êtes sur la bonne voie. Continuez à écouter vos utilisateurs.',
          },
          {
            id: 'p5_opt5',
            text: 'Feedback mitigé, quelques points à améliorer',
            value: 70,
            consequences: 'Normal! Itérez et améliorez votre produit.',
          },
          {
            id: 'p5_opt6',
            text: 'Pas encore de feedback utilisateur',
            value: 40,
            consequences: 'C\'est critique! Testez votre produit dès que possible.',
          },
        ],
        feedback: 'Le feedback utilisateur est votre meilleur guide pour améliorer votre produit.',
      },
    ],
  },
  {
    id: 6,
    title: 'Pré-pitch et validation',
    subtitle: 'Mesurez la maturité de votre projet',
    emoji: '🏆',
    description: 'Synthétisez votre parcours, créez un pitch et recevez un score de maturité.',
    questions: [
      {
        id: 'phase6_pitch',
        text: 'Pouvez-vous pitcher votre projet en 2 minutes?',
        options: [
          {
            id: 'p6_opt1',
            text: 'Oui, pitch clair et convaincant',
            value: 100,
            consequences: 'Excellent! Vous êtes prêt à convaincre vos premiers investisseurs.',
          },
          {
            id: 'p6_opt2',
            text: 'Partiellement, besoin de plus de pratique',
            value: 70,
            consequences: 'À travailler. Pratiquez votre pitch régulièrement.',
          },
          {
            id: 'p6_opt3',
            text: 'Non, trop compliqué à synthétiser',
            value: 40,
            consequences: 'Clarifiez votre message avant de pitcher.',
          },
        ],
        feedback: 'Un bon pitch est une compétence clé pour trouver du financement.',
      },
      {
        id: 'phase6_readiness',
        text: 'Vous sentez-vous prêt à commencer?',
        options: [
          {
            id: 'p6_opt4',
            text: 'Oui, très confiant et motivé',
            value: 100,
            consequences: 'Parfait! Lancez-vous maintenant! Vous êtes prêt.',
          },
          {
            id: 'p6_opt5',
            text: 'Partiellement, quelques inquiétudes',
            value: 70,
            consequences: 'C\'est normal. Adressez vos inquiétudes une par une.',
          },
          {
            id: 'p6_opt6',
            text: 'Non, trop de points à clarifier',
            value: 40,
            consequences: 'Prenez le temps qu\'il faut pour être confiant avant de commencer.',
          },
        ],
        feedback: 'La confiance et la clarté sont essentielles pour réussir.',
      },
    ],
  },
];

const PreIncubationGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentPhase: 1,
    currentQuestion: 0,
    answers: {},
    scores: {},
    projectData: {},
    isComplete: false,
    characterExpression: 'neutral',
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userName, setUserName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [characterExpression, setCharacterExpression] = useState<'neutral' | 'happy' | 'excited' | 'thinking' | 'celebrate'>('neutral');

  const currentPhase = GAME_PHASES[gameState.currentPhase - 1];
  const currentQuestion = currentPhase.questions[gameState.currentQuestion];
  const phaseProgress = Math.round(
    ((gameState.currentPhase - 1) * 100 + (gameState.currentQuestion / currentPhase.questions.length) * 100) / 600
  );

  const handleStartGame = () => {
    if (userName.trim() && projectName.trim()) {
      setCharacterExpression('excited');
      setGameStarted(true);
      createConfetti();
    }
  };

  const handleSelectAnswer = (optionId: string) => {
    setSelectedAnswer(optionId);
    setCharacterExpression('happy');
    setShowFeedback(true);
    createConfetti();
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) return;

    const option = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
    if (!option) return;

    const answerKey = `${gameState.currentPhase}_${currentQuestion.id}`;
    const newAnswers = {
      ...gameState.answers,
      [answerKey]: selectedAnswer,
    };

    const newScores = {
      ...gameState.scores,
      [gameState.currentPhase]:
        (gameState.scores[gameState.currentPhase] || 0) + option.value,
    };

    if (gameState.currentQuestion < currentPhase.questions.length - 1) {
      // Next question in same phase
      setGameState({
        ...gameState,
        currentQuestion: gameState.currentQuestion + 1,
        answers: newAnswers,
        scores: newScores,
      });
      setCharacterExpression('thinking');
    } else if (gameState.currentPhase < GAME_PHASES.length) {
      // Next phase
      setGameState({
        ...gameState,
        currentPhase: gameState.currentPhase + 1,
        currentQuestion: 0,
        answers: newAnswers,
        scores: newScores,
      });
      setCharacterExpression('excited');
      createConfetti();
    } else {
      // Game complete
      setGameState({
        ...gameState,
        answers: newAnswers,
        scores: newScores,
        isComplete: true,
        projectData: generateProjectData(newAnswers, newScores),
      });
      setCharacterExpression('celebrate');
      createConfetti();
      createConfetti();
    }

    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const generateProjectData = (answers: Record<string, string>, scores: Record<number, number>) => {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const maxScore = GAME_PHASES.length * 200; // Each phase has 2 questions max 100 each
    const maturityScore = Math.round((totalScore / maxScore) * 100);

    const projectData = {
      projectName,
      userName,
      createdAt: new Date().toLocaleDateString('fr-FR'),
      submittedAt: new Date().toISOString(),
      maturityScore,
      phaseScores: scores,
      totalScore,
      maxScore,
      evaluationStatus: 'pending',
      evaluationNotes: '',
      evaluatedBy: null,
      evaluatedAt: null,
      milestones: generateMilestones(maturityScore),
      recommendations: generateRecommendations(scores),
      projectMetadata: {
        version: '1.0',
        format: 'application/json',
        exportedAt: new Date().toISOString(),
      }
    };

    return projectData;
  };

  const generateMilestones = (score: number) => {
    const milestones = [];
    if (score >= 60) milestones.push('✓ Concept validé');
    if (score >= 70) milestones.push('✓ Marché identifié');
    if (score >= 80) milestones.push('✓ Prototype possible');
    if (score >= 90) milestones.push('✓ Prêt pour financement');
    return milestones.length > 0 ? milestones : ['📌 À développer'];
  };

  const generateRecommendations = (scores: Record<number, number>) => {
    const recommendations = [];
    
    if ((scores[1] || 0) < 150) recommendations.push('Clarifier davantage votre idée et votre cible');
    if ((scores[2] || 0) < 150) recommendations.push('Valider votre marché avec des utilisateurs réels');
    if ((scores[3] || 0) < 150) recommendations.push('Affiner votre modèle économique');
    if ((scores[4] || 0) < 150) recommendations.push('Développer une proposition de valeur plus forte');
    if ((scores[5] || 0) < 150) recommendations.push('Créer et tester un prototype rapidement');
    if ((scores[6] || 0) < 150) recommendations.push('Préparer un pitch plus convaincant');

    return recommendations.length > 0 ? recommendations : ['Bravo! Continuer sur cette lancée.'];
  };

  const downloadProject = async () => {
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    // Créer un élément temporaire avec le contenu formaté
    const pdfContent = document.createElement('div');
    pdfContent.style.padding = '40px';
    pdfContent.style.width = '800px';
    pdfContent.style.backgroundColor = 'white';
    pdfContent.style.position = 'absolute';
    pdfContent.style.left = '-9999px';
    pdfContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #667eea; margin: 0 0 10px; font-size: 28px;">📊 DOSSIER PROJET</h1>
        <p style="color: #999; font-size: 14px; margin: 0;">${new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
        <h2 style="color: #333; font-size: 18px; margin: 0 0 15px;">📋 Informations du projet</h2>
        <p style="margin: 8px 0; color: #555;"><strong>Nom du projet:</strong> ${gameState.projectData.projectName}</p>
        <p style="margin: 8px 0; color: #555;"><strong>Entrepreneur:</strong> ${gameState.projectData.userName}</p>
        <p style="margin: 8px 0; color: #555;"><strong>Date créée:</strong> ${new Date(gameState.projectData.createdAt).toLocaleDateString('fr-FR')}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin: 0 0 15px;">🎯 Score de maturité</h2>
        <div style="display: flex; align-items: center; gap: 20px;">
          <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold;">
            ${gameState.projectData.maturityScore}%
          </div>
          <div>
            <p style="margin: 0 0 8px; color: #333;"><strong>Score total:</strong> ${gameState.projectData.totalScore} / ${gameState.projectData.maxScore}</p>
            <p style="margin: 8px 0; color: #555; font-size: 14px;">Niveau: <strong>${gameState.projectData.maturityScore >= 80 ? 'Excellent' : gameState.projectData.maturityScore >= 60 ? 'Bon' : gameState.projectData.maturityScore >= 40 ? 'Acceptable' : 'À améliorer'}</strong></p>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin: 0 0 15px;">📈 Scores par phase</h2>
        ${Object.entries(gameState.projectData.phaseScores || {}).map((entry: any) => {
          const [phase, score] = entry;
          const maxScore = 300;
          const percentage = (score / maxScore) * 100;
          return `
            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #333;">${phase}</span>
                <span style="color: #666;">${score} / ${maxScore}</span>
              </div>
              <div style="height: 12px; background: #e0e0e0; border-radius: 6px; overflow: hidden;">
                <div style="height: 100%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); width: ${percentage}%;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin: 0 0 15px;">⭐ Jalons atteints</h2>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${gameState.projectData.milestones?.map((m: string) => `
            <li style="padding: 8px 0; color: #555; border-bottom: 1px solid #eee;">✓ ${m}</li>
          `).join('') || '<li style="color: #999;">Aucun jalon atteint pour le moment</li>'}
        </ul>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin: 0 0 15px;">💡 Recommandations</h2>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${gameState.projectData.recommendations?.map((r: string) => `
            <li style="padding: 8px 0; color: #555; border-bottom: 1px solid #eee;">→ ${r}</li>
          `).join('') || '<li style="color: #999;">Aucune recommandation</li>'}
        </ul>
      </div>

      <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
        <p style="margin: 0;">Généré par Digital Seeds - Plateforme de pré-incubation</p>
      </div>
    `;

    document.body.appendChild(pdfContent);

    try {
      const canvas = await html2canvas(pdfContent, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`projet_${projectName.replace(/\s+/g, '_')}.pdf`);

      createConfetti();
    } finally {
      document.body.removeChild(pdfContent);
    }

    // Sauvegarder en localStorage aussi
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects.push({
      ...gameState.projectData,
      id: `${projectName}_${Date.now()}`,
    });
    localStorage.setItem('projects', JSON.stringify(projects));
  };

  const submitProject = () => {
    setGameState({
      ...gameState,
      projectData: {
        ...gameState.projectData,
        submittedAt: new Date().toISOString(),
        evaluationStatus: 'pending',
      },
    });

    // Sauvegarder le projet soumis
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectIndex = projects.findIndex((p: any) => p.projectName === projectName);
    
    if (projectIndex >= 0) {
      projects[projectIndex] = {
        ...gameState.projectData,
        submittedAt: new Date().toISOString(),
        evaluationStatus: 'pending',
      };
    } else {
      projects.push({
        ...gameState.projectData,
        id: `${projectName}_${Date.now()}`,
        submittedAt: new Date().toISOString(),
        evaluationStatus: 'pending',
      });
    }
    localStorage.setItem('projects', JSON.stringify(projects));

    createConfetti();
    createConfetti();
  };

  const createConfetti = () => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: Math.random().toString(),
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  };

  const renderCharacter = () => {
    const expressions = {
      neutral: '😊',
      happy: '😄',
      excited: '🤩',
      thinking: '🤔',
      celebrate: '🎉',
    };
    return expressions[characterExpression];
  };

  if (!gameStarted) {
    return (
      <div className="game-container">
        <div className="stars-background">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="star" style={{ 
              '--delay': `${Math.random() * 5}s`,
              '--duration': `${3 + Math.random() * 4}s`,
            } as any}></div>
          ))}
        </div>
        
        {particles.map((p) => (
          <div 
            key={p.id} 
            className="confetti" 
            style={{ 
              left: `${p.x}%`, 
              top: `${p.y}%`,
              '--emoji': `"${['🚀', '💡', '⭐', '✨', '🎯'][Math.floor(Math.random() * 5)]}"`,
            } as any}
          ></div>
        ))}

        <div className="start-screen">
          <div className="character-container">
            <div className="character-card">
              <div className={`character ${characterExpression}`}>
                {renderCharacter()}
              </div>
              <p className="character-message">Prêt à lancer ton projet?</p>
            </div>
          </div>

          <div className="start-content">
            <h1 className="game-title">🚀 Jeu de Préincubation</h1>
            <p className="game-subtitle">Validez la maturité de votre projet entrepreneurial</p>

            <div className="form-group">
              <label htmlFor="userName">Votre nom</label>
              <input
                id="userName"
                type="text"
                placeholder="Ex: Marie Dupont"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectName">Nom du projet</label>
              <input
                id="projectName"
                type="text"
                placeholder="Ex: MyStartup"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="form-input"
              />
            </div>

            <button
              onClick={handleStartGame}
              disabled={!userName.trim() || !projectName.trim()}
              className="btn btn-primary btn-lg"
            >
              🎮 Commencer l'aventure
            </button>

            <div className="game-info">
              <h3>📋 Ce que vous allez faire:</h3>
              <ul>
                <li>✓ Clarifier votre idée en 6 phases</li>
                <li>✓ Répondre à des questions à conséquences</li>
                <li>✓ Recevoir du feedback pédagogique</li>
                <li>✓ Obtenir un score de maturité</li>
                <li>✓ Générer votre dossier projet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.isComplete) {
    const { maturityScore, phaseScores } = gameState.projectData;

    return (
      <div className="game-container">
        <div className="stars-background">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="star" style={{ 
              '--delay': `${Math.random() * 5}s`,
              '--duration': `${3 + Math.random() * 4}s`,
            } as any}></div>
          ))}
        </div>

        {particles.map((p) => (
          <div 
            key={p.id} 
            className="confetti" 
            style={{ 
              left: `${p.x}%`, 
              top: `${p.y}%`,
              '--emoji': `"🎉"`,
            } as any}
          ></div>
        ))}

        <div className="completion-screen">
          <div className="character-celebration">
            <div className="character-large">
              {renderCharacter()}
            </div>
          </div>

          <div className="completion-content">
            <h1 className="completion-title">🎉 Félicitations!</h1>
            <p className="completion-subtitle">Vous avez complété le jeu de préincubation</p>

            <div className="maturity-score">
              <div className="score-circle">
                <span className="score-value">{maturityScore}</span>
                <span className="score-label">%</span>
              </div>
              <p className="score-message">
                {maturityScore >= 80
                  ? '🌟 Excellent! Votre projet est très mature.'
                  : maturityScore >= 60
                  ? '✨ Bon travail! Quelques points à affiner.'
                  : maturityScore >= 40
                  ? '⚠️ Des efforts à faire pour améliorer la maturité.'
                  : '📚 À approfondir. Continuez vos validations.'}
              </p>
            </div>

            <div className="phase-scores">
              <h3>Scores par phase:</h3>
              {GAME_PHASES.map((phase) => (
                <div key={phase.id} className="phase-score">
                  <span className="phase-emoji">{phase.emoji}</span>
                  <span className="phase-name">{phase.title}</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${Math.round(
                          (phaseScores[phase.id] / (phase.questions.length * 100)) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="score-number">
                    {phaseScores[phase.id] || 0}/{phase.questions.length * 100}
                  </span>
                </div>
              ))}
            </div>

            <div className="project-summary">
              <h3>📄 Votre dossier projet:</h3>
              <div className="summary-item">
                <span>Nom du projet:</span>
                <strong>{gameState.projectData.projectName}</strong>
              </div>
              <div className="summary-item">
                <span>Auteur:</span>
                <strong>{gameState.projectData.userName}</strong>
              </div>
              <div className="summary-item">
                <span>Date:</span>
                <strong>{gameState.projectData.createdAt}</strong>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={downloadProject} className="btn btn-primary">
                📥 Télécharger le dossier projet
              </button>
              <button onClick={submitProject} className="btn btn-success">
                📤 Soumettre l'évaluation
              </button>
              <button
                onClick={() => {
                  setGameState({
                    currentPhase: 1,
                    currentQuestion: 0,
                    answers: {},
                    scores: {},
                    projectData: {},
                    isComplete: false,
                    characterExpression: 'neutral',
                  });
                  setGameStarted(false);
                  setSelectedAnswer(null);
                  setShowFeedback(false);
                  setCharacterExpression('neutral');
                }}
                className="btn btn-secondary"
              >
                🔄 Rejouer
              </button>
            </div>

            {gameState.projectData.evaluationStatus === 'pending' && (
              <div className="submission-status">
                <div className="status-badge pending">
                  ⏳ En attente d'évaluation
                </div>
                <p>Votre projet a été soumis pour évaluation par un mentor ou administrateur.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="stars-background">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="star" style={{ 
            '--delay': `${Math.random() * 5}s`,
            '--duration': `${3 + Math.random() * 4}s`,
          } as any}></div>
        ))}
      </div>

      {particles.map((p) => (
        <div 
          key={p.id} 
          className="confetti" 
          style={{ 
            left: `${p.x}%`, 
            top: `${p.y}%`,
            '--emoji': `"${['🚀', '💡', '⭐', '✨', '🎯'][Math.floor(Math.random() * 5)]}"`,
          } as any}
        ></div>
      ))}

      <div className="game-header">
        <div className="header-left">
          <h1 className="game-title">🎮 Jeu de Préincubation</h1>
          <span className="user-name">{userName}</span>
        </div>
        <div className="header-right">
          <div className="phase-badge">Phase {gameState.currentPhase} / 6</div>
          <div className="progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${phaseProgress}%` }}
              ></div>
            </div>
            <span className="progress-text">{phaseProgress}%</span>
          </div>
        </div>
      </div>

      <div className="game-body">
        <div className="character-mini">
          <span className="character-emoji">{renderCharacter()}</span>
        </div>

        <div className="phase-header">
          <span className="phase-number">Phase {gameState.currentPhase} / 6</span>
          <h2 className="phase-title">
            <span className="phase-emoji-title">{currentPhase.emoji}</span>
            {currentPhase.title}
          </h2>
          <p className="phase-subtitle">{currentPhase.subtitle}</p>
        </div>

        <div className="phase-content">
          <p className="phase-description">{currentPhase.description}</p>

          <div className="question-container">
            <h3 className="question-text">
              <span className="question-number">
                {gameState.currentQuestion + 1}/{currentPhase.questions.length}
              </span>
              {currentQuestion.text}
            </h3>

            <div className="options">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectAnswer(option.id)}
                  className={`option option-${index + 1} ${selectedAnswer === option.id ? 'selected' : ''}`}
                  disabled={showFeedback}
                >
                  <span className="option-radio">
                    {selectedAnswer === option.id && <span className="radio-inner"></span>}
                  </span>
                  <span className="option-text">{option.text}</span>
                </button>
              ))}
            </div>

            {showFeedback && selectedAnswer && (
              <div className="feedback-container">
                <div className="feedback-content">
                  <h4>💡 Feedback:</h4>
                  <p>{currentQuestion.feedback}</p>
                  <p className="consequence">
                    <strong>Conséquence:</strong>{' '}
                    {currentQuestion.options.find((opt) => opt.id === selectedAnswer)
                      ?.consequences}
                  </p>
                </div>

                <button onClick={handleNextQuestion} className="btn btn-success">
                  {gameState.currentPhase === GAME_PHASES.length &&
                  gameState.currentQuestion === currentPhase.questions.length - 1
                    ? '✨ Terminer le jeu'
                    : '⏭️ Question suivante'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="phase-nav">
          {gameState.currentPhase > 1 && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setCharacterExpression('thinking');
                if (gameState.currentQuestion > 0) {
                  setGameState({
                    ...gameState,
                    currentQuestion: gameState.currentQuestion - 1,
                  });
                } else {
                  const prevPhase = GAME_PHASES[gameState.currentPhase - 2];
                  setGameState({
                    ...gameState,
                    currentPhase: gameState.currentPhase - 1,
                    currentQuestion: prevPhase.questions.length - 1,
                  });
                }
                setSelectedAnswer(null);
                setShowFeedback(false);
              }}
            >
              ← Précédent
            </button>
          )}
          <span className="phases-indicator">
            {gameState.currentPhase} / {GAME_PHASES.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PreIncubationGame;
