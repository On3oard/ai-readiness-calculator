import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, FileText, Download, Users, DollarSign, Target, Zap, AlertCircle, Clock, Clipboard } from 'lucide-react';

// Simple data storage utility
const saveAssessmentData = (data) => {
  console.log('Assessment Data Saved:', data);
  // In a real application, this would send to your backend
  return Promise.resolve({ success: true, id: Date.now() });
};

// Logo Component
const LogoComponent = ({ size = 96, pageType = 'main' }) => {
  const uniqueId = `${pageType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`mainGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="25%" stopColor="#f59e0b" stopOpacity="1" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="1" />
            <stop offset="75%" stopColor="#ef4444" stopOpacity="1" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="none" stroke={`url(#mainGrad-${uniqueId})`} strokeWidth="6"/>
        <circle cx="100" cy="100" r="85" fill="none" stroke="white" strokeWidth="4"/>
        <circle cx="100" cy="100" r="78" fill={`url(#mainGrad-${uniqueId})`}/>
        <text x="100" y="85" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Arial, sans-serif">
          ON3OARD
        </text>
        <text x="100" y="105" textAnchor="middle" fill="white" fontSize="9" fontFamily="Arial, sans-serif" opacity="0.9">
          your business . our priority
        </text>
      </svg>
    </div>
  );
};

// Main Calculator Component
const AIReadinessCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [leadInfo, setLeadInfo] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [copyStatus, setCopyStatus] = useState('Copy Link');
  // ===> You MUST update this URL to your live, deployed application URL. <===
  const [shareableLink, setShareableLink] = useState('https://www.on3oard.com/ai-readiness-calculator');


  const industries = [
    "Technology", "Healthcare", "Finance & Banking", "Manufacturing", 
    "Retail & E-commerce", "Education", "Real Estate", "Marketing & Advertising",
    "Consulting", "Legal Services", "Construction", "Transportation & Logistics",
    "Hospitality", "Non-profit", "Government", "Other"
  ];

  const questions = [
    {
      id: 'industry',
      question: "What industry does your company operate in?",
      type: 'dropdown',
      options: industries,
      weight: 0
    },
    {
      id: 'ai_awareness',
      question: "How would you describe your organization's current understanding of AI technologies?",
      type: 'radio',
      options: [
        { text: "We're AI experts - actively using multiple AI solutions", value: 4 },
        { text: "Good understanding - we use some AI tools regularly", value: 3 },
        { text: "Basic awareness - we know about AI but limited usage", value: 2 },
        { text: "Minimal knowledge - AI is new territory for us", value: 1 }
      ],
      weight: 20
    },
    {
      id: 'data_infrastructure',
      question: "How organized and accessible is your company's data?",
      type: 'radio',
      options: [
        { text: "Highly organized - centralized, clean, and easily accessible", value: 4 },
        { text: "Mostly organized - some centralization with minor gaps", value: 3 },
        { text: "Partially organized - scattered across different systems", value: 2 },
        { text: "Poorly organized - data is siloed and hard to access", value: 1 }
      ],
      weight: 25
    },
    {
      id: 'team_readiness',
      question: "How would you rate your team's comfort level with adopting new technologies?",
      type: 'radio',
      options: [
        { text: "Very comfortable - we're early adopters who embrace change", value: 4 },
        { text: "Moderately comfortable - open to change with proper training", value: 3 },
        { text: "Somewhat hesitant - need significant support for new tech", value: 2 },
        { text: "Resistant to change - prefer traditional methods", value: 1 }
      ],
      weight: 15
    },
    {
      id: 'budget_mindset',
      question: "What's your approach to investing in technology solutions?",
      type: 'radio',
      options: [
        { text: "Strategic investor - willing to invest significantly for ROI", value: 4 },
        { text: "Calculated investor - moderate budget for proven solutions", value: 3 },
        { text: "Conservative investor - small budget for essential tools only", value: 2 },
        { text: "Cost-focused - prefer free or very low-cost solutions", value: 1 }
      ],
      weight: 15
    },
    {
      id: 'pain_points',
      question: "What are your biggest operational challenges? (Select all that apply)",
      type: 'checkbox',
      options: [
        { text: "Manual, repetitive tasks consuming too much time", value: 1 },
        { text: "Difficulty analyzing data to make informed decisions", value: 1 },
        { text: "Poor customer service response times", value: 1 },
        { text: "Inefficient communication and collaboration", value: 1 },
        { text: "Inventory or resource management issues", value: 1 },
        { text: "Quality control and error reduction", value: 1 },
        { text: "Scaling operations effectively", value: 1 },
        { text: "Competitive disadvantage in the market", value: 1 }
      ],
      weight: 10
    },
    {
      id: 'implementation_timeline',
      question: "What's your ideal timeline for implementing AI solutions?",
      type: 'radio',
      options: [
        { text: "Immediately - we need solutions now", value: 4 },
        { text: "Within 3 months - fairly urgent", value: 3 },
        { text: "Within 6-12 months - planned implementation", value: 2 },
        { text: "Over 12 months - long-term consideration", value: 1 }
      ],
      weight: 10
    },
    {
      id: 'decision_authority',
      question: "What's your role in technology purchasing decisions?",
      type: 'radio',
      options: [
        { text: "Final decision maker - I approve technology investments", value: 4 },
        { text: "Strong influence - I recommend and influence decisions", value: 3 },
        { text: "Some input - I provide feedback on technology choices", value: 2 },
        { text: "Limited input - Others make these decisions", value: 1 }
      ],
      weight: 5
    }
  ];

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(question => {
      if (question.type === 'checkbox') {
        const selectedOptions = answers[question.id] || [];
        totalScore += selectedOptions.length * question.weight;
        maxScore += question.options.length * question.weight;
      } else if (question.weight > 0) {
        const answer = answers[question.id];
        if (answer) {
          totalScore += answer * question.weight;
          maxScore += 4 * question.weight;
        }
      }
    });

    const percentage = Math.round((totalScore / maxScore) * 100);
    setScore(percentage);

    let calculatedCategory = '';
    if (percentage >= 80) calculatedCategory = 'AI Pioneers';
    else if (percentage >= 65) calculatedCategory = 'Strategic Adopters';
    else if (percentage >= 45) calculatedCategory = 'Emerging Explorers';
    else calculatedCategory = 'Foundation Builders';
    
    setCategory(calculatedCategory);
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateScore();
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLeadSubmit = async () => {
    setSubmissionStatus('submitting');
    
    try {
      const assessmentData = {
        ...leadInfo,
        answers,
        score,
        category,
        painPoints: answers.pain_points || [],
        submissionId: `on3oard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };

      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      await saveAssessmentData(assessmentData);
      
      setSubmissionStatus('success');
      setShowResults(true);
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmissionStatus('error');
    }
  };

  const handleCopyLink = () => {
    // This is the shareable link. Please update this URL to your live, deployed application URL.
    const link = shareableLink;
    const tempInput = document.createElement('textarea');
    tempInput.value = link;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy Link'), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      setCopyStatus('Failed to Copy');
      setTimeout(() => setCopyStatus('Copy Link'), 2000);
    }
    document.body.removeChild(tempInput);
  };

  const getCategoryInfo = (cat) => {
    const info = {
      'AI Pioneers': {
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
        icon: <Zap className="w-8 h-8 text-green-600" />,
        description: 'Your organization is ready for advanced AI implementation with strong foundations in place.',
        recommendations: [
          'Implement advanced AI solutions for competitive advantage',
          'Develop AI governance and ethics frameworks',
          'Scale AI across multiple departments',
          'Consider AI-first business model innovations'
        ]
      },
      'Strategic Adopters': {
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200',
        icon: <Target className="w-8 h-8 text-blue-600" />,
        description: 'You have a solid foundation and are well-positioned for strategic AI adoption.',
        recommendations: [
          'Start with pilot AI projects in high-impact areas',
          'Invest in team training and change management',
          'Develop clear AI strategy and roadmap',
          'Build data infrastructure for AI readiness'
        ]
      },
      'Emerging Explorers': {
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200',
        icon: <Users className="w-8 h-8 text-orange-600" />,
        description: 'Your organization shows interest in AI but needs development in key areas.',
        recommendations: [
          'Begin with simple AI tools and automation',
          'Focus on data organization and accessibility',
          'Provide AI literacy training for leadership',
          'Identify quick wins to build momentum'
        ]
      },
      'Foundation Builders': {
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 border-purple-200',
        icon: <DollarSign className="w-8 h-8 text-purple-600" />,
        description: 'Focus on building fundamental capabilities before major AI investments.',
        recommendations: [
          'Start with basic digital transformation',
          'Improve data collection and organization',
          'Build technology adoption culture',
          'Consider AI education and awareness programs'
        ]
      }
    };
    return info[cat] || info['Foundation Builders'];
  };

  const generatePDFReport = () => {
    const categoryInfo = getCategoryInfo(category);
    const reportContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AI Readiness Assessment Report - ${leadInfo.companyName || 'Company'}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #f97316;
            padding-bottom: 20px;
        }
        .logo-section {
            margin-bottom: 20px;
        }
        .score-section {
            background: linear-gradient(135deg, #fef3e2, #fee2e2, #fdf2f8);
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
            border: 2px solid #f97316;
        }
        .score {
            font-size: 48px;
            font-weight: bold;
            color: #f97316;
            margin: 20px 0;
        }
        .category {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin: 15px 0;
        }
        .section {
            margin: 30px 0;
            padding: 20px;
            border-left: 4px solid #f97316;
            background: #f8fafc;
        }
        .section h2 {
            color: #f97316;
            margin-top: 0;
            border-bottom: 2px solid #f97316;
            padding-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f8fafc;
            font-weight: bold;
            color: #f97316;
        }
        .recommendations ul, .pain-points ul {
            margin: 15px 0;
            padding-left: 25px;
        }
        .recommendations li, .pain-points li {
            margin-bottom: 8px;
        }
        .contact-section {
            background: #f97316;
            color: white;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            margin-top: 30px;
        }
        .contact-section h2 {
            color: white;
            border-bottom: 2px solid white;
            margin-top: 0;
        }
        @media print {
            body { margin: 0; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-section">
            <svg width="120" height="120" viewBox="0 0 200 200" style="margin: 0 auto 20px; display: block;" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="pdfMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#fbbf24" stop-opacity="1" />
                        <stop offset="25%" stop-color="#f59e0b" stop-opacity="1" />
                        <stop offset="50%" stop-color="#f97316" stop-opacity="1" />
                        <stop offset="75%" stop-color="#ef4444" stop-opacity="1" />
                        <stop offset="100%" stop-color="#ec4899" stop-opacity="1" />
                    </linearGradient>
                    <linearGradient id="pdfRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#fbbf24" stop-opacity="1" />
                        <stop offset="30%" stop-color="#f59e0b" stop-opacity="1" />
                        <stop offset="60%" stop-color="#f97316" stop-opacity="1" />
                        <stop offset="80%" stop-color="#ef4444" stop-opacity="1" />
                        <stop offset="100%" stop-color="#ec4899" stop-opacity="1" />
                    </linearGradient>
                </defs>
                
                <circle cx="100" cy="100" r="95" fill="none" stroke="url(#pdfRingGrad)" stroke-width="6"/>
                <circle cx="100" cy="100" r="85" fill="none" stroke="white" stroke-width="4"/>
                <circle cx="100" cy="100" r="78" fill="url(#pdfMainGrad)"/>
                
                <text x="100" y="85" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial, sans-serif">
                    ON3OARD
                </text>
                
                <text x="100" y="105" text-anchor="middle" fill="white" font-size="9" font-family="Arial, sans-serif" opacity="0.9">
                    your business . our priority
                </text>
            </svg>
        </div>
        <h1>AI Readiness Assessment Report</h1>
        <p>Generated on ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
    </div>

    <div class="section">
        <h2>Company Information</h2>
        <table>
            <tr><th>Company Name</th><td>${leadInfo.companyName || 'N/A'}</td></tr>
            <tr><th>Contact Person</th><td>${leadInfo.contactName || 'N/A'}</td></tr>
            <tr><th>Email</th><td>${leadInfo.email || 'N/A'}</td></tr>
            <tr><th>Industry</th><td>${answers.industry || 'N/A'}</td></tr>
            <tr><th>Company Size</th><td>${leadInfo.companySize || 'N/A'}</td></tr>
            <tr><th>Annual Revenue</th><td>${leadInfo.revenue || 'N/A'}</td></tr>
            <tr><th>AI Implementation Budget</th><td>${leadInfo.budget || 'N/A'}</td></tr>
        </table>
    </div>

    <div class="score-section">
        <h2>Your AI Readiness Assessment</h2>
        <div class="score">${score}%</div>
        <div class="category">${category}</div>
        <p style="font-size: 16px; margin-top: 20px;">
            ${categoryInfo.description}
        </p>
    </div>

    <div class="section">
        <h2>Assessment Breakdown</h2>
        <table>
            <tr><th>Assessment Area</th><th>Your Response</th></tr>
            <tr><td><strong>AI Awareness Level</strong></td><td>${questions[1].options.find(opt => opt.value === answers.ai_awareness)?.text || 'Not specified'}</td></tr>
            <tr><td><strong>Data Infrastructure</strong></td><td>${questions[2].options.find(opt => opt.value === answers.data_infrastructure)?.text || 'Not specified'}</td></tr>
            <tr><td><strong>Team Readiness</strong></td><td>${questions[3].options.find(opt => opt.value === answers.team_readiness)?.text || 'Not specified'}</td></tr>
            <tr><td><strong>Investment Approach</strong></td><td>${questions[4].options.find(opt => opt.value === answers.budget_mindset)?.text || 'Not specified'}</td></tr>
            <tr><td><strong>Implementation Timeline</strong></td><td>${questions[6].options.find(opt => opt.value === answers.implementation_timeline)?.text || 'Not specified'}</td></tr>
            <tr><td><strong>Decision Authority</strong></td><td>${questions[7].options.find(opt => opt.value === answers.decision_authority)?.text || 'Not specified'}</td></tr>
        </table>
    </div>

    ${answers.pain_points && answers.pain_points.length > 0 ? `
    <div class="section pain-points">
        <h2>Identified Pain Points</h2>
        <p><strong>Your organization identified these key challenges:</strong></p>
        <ul>
            ${answers.pain_points.map(point => `<li>${point}</li>`).join('')}
        </ul>
        <p><em>These areas represent prime opportunities for AI-driven improvements and efficiency gains.</em></p>
    </div>
    ` : ''}

    <div class="section recommendations">
        <h2>Strategic Recommendations</h2>
        <p><strong>Based on your ${category} status, we recommend:</strong></p>
        <ul>
            ${categoryInfo.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>

    <div class="contact-section">
        <h2>Ready to Start Your AI Journey?</h2>
        <p><strong>On3oard is here to guide your transformation every step of the way.</strong></p>
        <p>📞 Schedule your free consultation<br>
            📧 Email: support@on3oard.com<br>
            🌐 Website: www.on3oard.com</p>
        <p><em>Your business success is our priority.</em></p>
    </div>

    <script>
        // Auto-trigger print dialog when page loads
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 1000);
        };
    </script>
</body>
</html>`;

    // Create blob and download HTML file
    const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(leadInfo.companyName || 'Company').replace(/[^a-zA-Z0-9]/g, '_')}_AI_Readiness_Report.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Also open in new window for immediate viewing and printing
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(reportContent);
      newWindow.document.close();
    }
  };

  // Submission status component
  const SubmissionStatusAlert = ({ status }) => {
    if (status === 'idle') return null;

    if (status === 'submitting') {
      return (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
          <Clock className="w-5 h-5 text-blue-600 mr-3 animate-spin" />
          <div>
            <h4 className="font-semibold text-blue-800">Processing Your Assessment...</h4>
            <p className="text-blue-600 text-sm">Please wait while we analyze your responses.</p>
          </div>
        </div>
      );
    }

    if (status === 'success') {
      return (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <h4 className="font-semibold text-green-800">Assessment Completed Successfully!</h4>
          </div>
          <p className="text-green-600 text-sm">Your AI readiness assessment has been processed.</p>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <h4 className="font-semibold text-red-800">Processing Issue</h4>
          </div>
          <p className="text-red-600 text-sm">There was an issue processing your assessment. Please try again.</p>
          <button 
            onClick={handleLeadSubmit}
            className="mt-3 text-red-600 underline hover:text-red-800"
          >
            Retry Submission
          </button>
        </div>
      );
    }

    return null;
  };

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const isLeadCapture = currentStep === questions.length;

  if (showResults) {
    const categoryInfo = getCategoryInfo(category);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4">
              <LogoComponent size={96} pageType="results" />
            </div>
            <p className="text-gray-600">your business . our priority</p>
          </div>

          <SubmissionStatusAlert status={submissionStatus} />

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Your AI Readiness Assessment</h1>
              <p className="text-gray-600">Complete analysis of your organization's AI adoption readiness</p>
            </div>

            <div className={`rounded-xl p-6 mb-8 border-2 ${categoryInfo.bgColor}`}>
              <div className="flex items-center justify-center mb-4">
                {categoryInfo.icon}
                <div className="ml-4 text-center">
                  <h2 className={`text-2xl font-bold ${categoryInfo.color}`}>{category}</h2>
                  <p className="text-lg font-semibold text-gray-700">Readiness Score: {score}%</p>
                </div>
              </div>
              <p className="text-gray-700 text-center">{categoryInfo.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Next Steps</h3>
                <ul className="space-y-2">
                  {categoryInfo.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-5 h-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Pain Points Analysis</h3>
                <div className="space-y-2">
                  {answers.pain_points?.map((point, index) => (
                    <div key={index} className="flex items-center">
                      <Target className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-gray-700 text-sm">{point}</span>
                    </div>
                  )) || <p className="text-gray-500 text-sm">No specific pain points identified</p>}
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Ready to Transform Your Business?</h3>
              <p className="text-gray-700 mb-4">
                Schedule a free consultation to discuss how On3oard can help accelerate your AI journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={generatePDFReport}
                  className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Generate Report
                </button>
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center justify-center border-2 border-orange-500 text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Share Calculator
                </button>
              </div>
            </div>
          </div>

          {showShareModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Share AI Readiness Calculator</h3>
                  <p className="text-gray-600 mb-6">Help others assess their AI readiness with On3oard</p>
                </div>
                <div className="flex items-center space-x-2 mb-6">
                  <input
                    type="text"
                    onChange={(e) => setShareableLink(e.target.value)}
                    value={shareableLink}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-all flex items-center justify-center text-sm font-medium"
                  >
                    <Clipboard className="w-4 h-4 mr-2" />
                    {copyStatus}
                  </button>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-600 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isLeadCapture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4">
              <LogoComponent size={96} pageType="lead" />
            </div>
            <p className="text-gray-600">your business . our priority</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <FileText className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Get Your AI Readiness Report</h2>
              <p className="text-gray-600">Enter your details to receive personalized recommendations</p>
            </div>

            <SubmissionStatusAlert status={submissionStatus} />

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={leadInfo.companyName || ''}
                    onChange={(e) => setLeadInfo({...leadInfo, companyName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={leadInfo.contactName || ''}
                    onChange={(e) => setLeadInfo({...leadInfo, contactName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your Full Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Email Address *</label>
                <input
                  type="email"
                  required
                  value={leadInfo.email || ''}
                  onChange={(e) => setLeadInfo({...leadInfo, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="name@company.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size *</label>
                  <select
                    required
                    value={leadInfo.companySize || ''}
                    onChange={(e) => setLeadInfo({...leadInfo, companySize: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select size...</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1,000 employees</option>
                    <option value="1000+">1,000+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Revenue *</label>
                  <select
                    required
                    value={leadInfo.revenue || ''}
                    onChange={(e) => setLeadInfo({...leadInfo, revenue: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select range...</option>
                    <option value="<$1M">Less than $1M</option>
                    <option value="$1M-$5M">$1M - $5M</option>
                    <option value="$5M-$25M">$5M - $25M</option>
                    <option value="$25M-$100M">$25M - $100M</option>
                    <option value="$100M+">$100M+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Implementation Budget *</label>
                <select
                  required
                  value={leadInfo.budget || ''}
                  onChange={(e) => setLeadInfo({...leadInfo, budget: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select budget range...</option>
                  <option value="<$10K">Less than $10K</option>
                  <option value="$10K-$50K">$10K - $50K</option>
                  <option value="$50K-$250K">$50K - $250K</option>
                  <option value="$250K-$1M">$250K - $1M</option>
                  <option value="$1M+">$1M+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={leadInfo.phone || ''}
                  onChange={(e) => setLeadInfo({...leadInfo, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
                <button
                  onClick={handleLeadSubmit}
                  disabled={
                    submissionStatus === 'submitting' ||
                    !leadInfo.companyName || 
                    !leadInfo.contactName || 
                    !leadInfo.email || 
                    !leadInfo.companySize || 
                    !leadInfo.revenue || 
                    !leadInfo.budget
                  }
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submissionStatus === 'submitting' && <Clock className="w-5 h-5 mr-2 animate-spin" />}
                  {submissionStatus === 'submitting' ? 'Processing...' : 'Get My Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4">
            <LogoComponent size={96} pageType="main" />
          </div>
          <p className="text-gray-600">your business . our priority</p>
          <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">AI Readiness Assessment</h1>
          <p className="text-gray-600">Discover how ready your organization is for AI transformation</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{currentQuestion.question}</h2>

          {currentQuestion.type === 'dropdown' && (
            <select
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
            >
              <option value="">Select your industry...</option>
              {currentQuestion.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          )}

          {currentQuestion.type === 'radio' && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.value}
                    checked={answers[currentQuestion.id] === option.value}
                    onChange={(e) => handleAnswer(currentQuestion.id, parseInt(e.target.value))}
                    className="mt-1 mr-4 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-gray-700">{option.text}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'checkbox' && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={(answers[currentQuestion.id] || []).includes(option.text)}
                    onChange={(e) => {
                      const current = answers[currentQuestion.id] || [];
                      if (e.target.checked) {
                        handleAnswer(currentQuestion.id, [...current, option.text]);
                      } else {
                        handleAnswer(currentQuestion.id, current.filter(item => item !== option.text));
                      }
                    }}
                    className="mt-1 mr-4 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-gray-700">{option.text}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id] || (currentQuestion.type === 'checkbox' && (!answers[currentQuestion.id] || answers[currentQuestion.id].length === 0))}
            className="flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastQuestion ? 'Complete Assessment' : 'Next Question'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIReadinessCalculator;
