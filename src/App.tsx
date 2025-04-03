import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Button, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Snackbar, Alert, Paper, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Chip, GlobalStyles, IconButton, Grid, Tab, Tabs } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import Resume from './components/Resume';
import ResumeForm from './components/ResumeForm';
import { ResumeData } from './components/Resume';

// Define page count type to be used throughout the app
type PageCountType = 1 | 2 | 3 | 4 | 5;

// Define cover letter data type
interface CoverLetterData {
  recipientCompany: string;
  recipientName: string;
  jobTitle: string;
  jobId?: string;
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderEmail: string;
  senderPhone: string;
  letterContent: string;
  style: 'pro' | 'normal';
  date: string;
}

const fonts = [
  'Times New Roman',
  'Arial',
  'Helvetica',
  'Georgia',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Open Sans',
  'Roboto',
  'Lato',
];

const jobRoles = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Product Manager',
  'UX Designer',
  'Project Manager',
  'Business Analyst',
  'Cyber Security Engineer',
];

const skillSuggestions: { [key: string]: string[] } = {
  'Software Engineer': [
    'JavaScript', 'Python', 'Java', 'C++', 'SQL', 'Git', 'REST APIs',
    'System Design', 'Algorithms', 'Data Structures', 'Agile', 'CI/CD'
  ],
  'Frontend Developer': [
    'React', 'Angular', 'Vue.js', 'JavaScript', 'TypeScript', 'HTML5',
    'CSS3', 'SASS', 'Webpack', 'Responsive Design', 'UI/UX', 'Testing'
  ],
  'Backend Developer': [
    'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'Redis', 'Docker',
    'Kubernetes', 'Microservices', 'REST APIs', 'GraphQL', 'AWS'
  ],
  'Full Stack Developer': [
    'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'Docker',
    'AWS', 'CI/CD', 'REST APIs', 'TypeScript', 'Git', 'Agile'
  ],
  'DevOps Engineer': [
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins', 'GitLab CI',
    'Terraform', 'Ansible', 'Shell Scripting', 'Linux', 'Monitoring', 'CI/CD'
  ],
  'Data Scientist': [
    'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'TensorFlow',
    'PyTorch', 'Data Analysis', 'Statistics', 'Pandas', 'NumPy', 'Scikit-learn'
  ],
  'Product Manager': [
    'Product Strategy', 'Agile', 'Scrum', 'User Research', 'Market Analysis',
    'Product Roadmap', 'Stakeholder Management', 'Data Analysis', 'JIRA'
  ],
  'UX Designer': [
    'Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping',
    'UI Design', 'Interaction Design', 'Design Systems', 'Usability Testing'
  ],
  'Project Manager': [
    'Agile', 'Scrum', 'JIRA', 'Risk Management', 'Stakeholder Management',
    'Resource Planning', 'Budget Management', 'Team Leadership', 'Communication'
  ],
  'Business Analyst': [
    'Requirements Analysis', 'Data Analysis', 'SQL', 'Business Process',
    'Documentation', 'Stakeholder Management', 'Agile', 'JIRA', 'UML'
  ],
  'Cyber Security Engineer': [
    'Network Security', 'Penetration Testing', 'Ethical Hacking', 'SIEM Tools',
    'Firewall Management', 'Security Auditing', 'Incident Response', 'Malware Analysis',
    'Vulnerability Assessment', 'Security Compliance', 'Cryptography', 'Cloud Security'
  ],
};

const initialResumeData: ResumeData = {
  personalInfo: {
    name: '',
    linkedin: '',
    location: '',
    email: '',
    mobile: '',
  },
  summary: '',
  education: [],
  skills: {
    'Technical Skills': [],
    'Soft Skills': [],
    'Tools & Technologies': [],
  },
  projects: [],
  certifications: [],
  publications: [],
};

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [selectedFont, setSelectedFont] = useState('Times New Roman');
  const [selectedTemplate, setSelectedTemplate] = useState<'amazon' | 'meta' | 'apple' | 'google' | 'microsoft' | 'custom' | 'two-column'>('custom');
  const [pageCount, setPageCount] = useState<PageCountType>(1);
  const [contentOverflow, setContentOverflow] = useState(false);
  const [autoOptimized, setAutoOptimized] = useState(false);
  const [tailoredContent, setTailoredContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState<boolean>(false);
  const [skillSuggestionCategory, setSkillSuggestionCategory] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showAtsFeedback, setShowAtsFeedback] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [showDownloadDialog, setShowDownloadDialog] = useState<boolean>(false);
  const [downloadFormat, setDownloadFormat] = useState<PageCountType | null>(null);
  const [isPreparingDownload, setIsPreparingDownload] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showCoverLetterDialog, setShowCoverLetterDialog] = useState<boolean>(false);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
    recipientCompany: '',
    recipientName: 'Hiring Manager',
    jobTitle: '',
    jobId: '',
    senderName: '',
    senderAddress: '',
    senderCity: '',
    senderEmail: '',
    senderPhone: '',
    letterContent: '',
    style: 'normal',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  });
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string>('');
  const [coverLetterPreview, setShowCoverLetterPreview] = useState<boolean>(false);
  const coverLetterRef = useRef<HTMLDivElement>(null);

  // Handle printing resume
  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: 'Resume',
  });

  // Handle printing cover letter
  const handlePrintCoverLetter = useReactToPrint({
    contentRef: coverLetterRef,
    documentTitle: 'Cover Letter',
  });

  const handleJobRoleSelect = (role: string) => {
    setSelectedJobRole(role);
    setShowSkillSuggestions(true);
  };

  const handleOpenSkillSuggestions = (category: string) => {
    setSkillSuggestionCategory(category);
    setSelectedSkills([]);
    setShowSkillSuggestions(true);
  };

  const handleCloseSkillSuggestions = () => {
      setShowSkillSuggestions(false);
    setSkillSuggestionCategory('');
  };

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const handleAddSelectedSkills = () => {
    if (selectedSkills.length === 0 || !skillSuggestionCategory) return;
    
    const updatedSkills = { ...resumeData.skills };
    
    const newSkills = selectedSkills.filter(
      skill => !updatedSkills[skillSuggestionCategory].includes(skill)
    );
    
    if (newSkills.length > 0) {
      updatedSkills[skillSuggestionCategory] = [
        ...updatedSkills[skillSuggestionCategory],
        ...newSkills
      ];
      
      setResumeData({
        ...resumeData,
        skills: updatedSkills
      });
    }
    
    handleCloseSkillSuggestions();
  };

  const calculateAtsScore = () => {
    // Enhanced ATS scoring based on multiple factors
    const allSkills = Object.values(resumeData.skills).flat();
    const uniqueSkills = Array.from(new Set(allSkills));
    
    // Calculate scores for different aspects
    const skillsScore = Math.min(100, (uniqueSkills.length / 15) * 100); // 15 skills is a good target
    const educationScore = resumeData.education.length > 0 ? 100 : 0;
    const projectsScore = Math.min(100, (resumeData.projects.length / 3) * 100); // 3 projects is a good target
    const certificationsScore = Math.min(100, (resumeData.certifications.length / 2) * 100); // 2 certifications is a good target
    const summaryScore = resumeData.summary.length > 100 ? 100 : (resumeData.summary.length / 100) * 100;
    const contactInfoScore = 
      (resumeData.personalInfo.name ? 20 : 0) + 
      (resumeData.personalInfo.email ? 20 : 0) + 
      (resumeData.personalInfo.mobile ? 20 : 0) + 
      (resumeData.personalInfo.location ? 20 : 0) + 
      (resumeData.personalInfo.linkedin ? 20 : 0);
    
    // Weighted average of all scores
    const totalScore = Math.round(
      (skillsScore * 0.35) +
      (educationScore * 0.15) +
      (projectsScore * 0.20) +
      (certificationsScore * 0.10) +
      (summaryScore * 0.10) +
      (contactInfoScore * 0.10)
    );
    
    setAtsScore(totalScore);
  };

  const handleTailoredContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    setTailoredContent(content);
    try {
      const parsedData = JSON.parse(content);
      setResumeData(parsedData);
      calculateAtsScore();
    } catch (error) {
      // Don't update resume data if JSON is invalid
    }
  };

  const handleConvertContent = () => {
    try {
      // Basic parsing of the tailored content
      const lines = tailoredContent.split('\n');
      const newData = { ...initialResumeData };
      
      let currentSection = '';
      let currentSkills: string[] = [];
      
      lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        // Detect sections
        if (line.toLowerCase().includes('education')) {
          currentSection = 'education';
        } else if (line.toLowerCase().includes('skills')) {
          currentSection = 'skills';
        } else if (line.toLowerCase().includes('projects')) {
          currentSection = 'projects';
        } else if (line.toLowerCase().includes('certifications')) {
          currentSection = 'certifications';
        } else if (line.toLowerCase().includes('summary')) {
          currentSection = 'summary';
        } else {
          // Process content based on current section
          switch (currentSection) {
            case 'education':
              if (line.includes('|')) {
                const [school, degree, location, date] = line.split('|').map(s => s.trim());
                newData.education.push({ 
                  school, 
                  degree, 
                  location: location || 'Not specified',
                  date,
                  gpa: undefined 
                });
              }
              break;
            case 'skills':
              currentSkills.push(line);
              break;
            case 'projects':
              if (line.includes('|')) {
                const [title, description, tech, date] = line.split('|').map(s => s.trim());
                newData.projects.push({ 
                  title, 
                  description, 
                  tech: tech || 'Not specified',
                  date 
                });
              }
              break;
            case 'certifications':
              if (line.includes('|')) {
                const [name, details, company, date] = line.split('|').map(s => s.trim());
                newData.certifications.push({ 
                  name, 
                  details: details || 'Not specified',
                  company,
                  date 
                });
              }
              break;
            case 'summary':
              newData.summary += line + ' ';
              break;
          }
        }
      });
      
      // Update skills
      if (currentSkills.length > 0) {
        newData.skills['Technical Skills'] = currentSkills;
      }
      
      setResumeData(newData);
      calculateAtsScore();
      setTailoredContent(JSON.stringify(newData, null, 2));
    } catch (error) {
      setError('Failed to convert content. Please check the format.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content);
          setResumeData(parsedData);
          setTailoredContent(content);
        } catch (error) {
          setError('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadJSON = () => {
    const jsonString = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFinish = () => {
    calculateAtsScore();
    setIsFinished(true);
    setShowAtsFeedback(true);
  };

  const handleCloseAtsFeedback = () => {
    setShowAtsFeedback(false);
  };

  // Handler for page overflow notification with enhanced logic
  const handlePageOverflow = (isOverflowing: boolean) => {
    setContentOverflow(isOverflowing);
    
    // Auto-optimize content when overflowing the current page count
    if (isOverflowing && !autoOptimized) {
      optimizeContentForPages(pageCount);
    }
  };
  
  // Function to optimize content for specified page count
  const optimizeContentForPages = (targetPages: PageCountType) => {
    // Don't trim content, but notify the Resume component to adjust font size
    // This function is now primarily for compatibility with existing code
    setAutoOptimized(true);
  };
  
  // Handler for opening the download dialog
  const handleOpenDownloadDialog = () => {
    setShowDownloadDialog(true);
  };

  // Handler for closing the download dialog
  const handleCloseDownloadDialog = () => {
    setShowDownloadDialog(false);
    setDownloadFormat(null);
    setIsPreparingDownload(false);
  };

  // Handler for optimized PDF download with format selection
  const handleOptimizedPrint = (selectedPageCount: PageCountType) => {
    setDownloadFormat(selectedPageCount);
    setIsPreparingDownload(true);
    
    // Store the current page count to restore later
    const originalPageCount = pageCount;
    
    // Set the selected page count
    setPageCount(selectedPageCount);
    
    // Let the Resume component handle font adjustments
    setAutoOptimized(true);
    
    // Show feedback to user about optimization in progress
    setSnackbarMessage(selectedPageCount === 1 
      ? 'Optimizing content for single page...' 
      : `Organizing content across ${selectedPageCount} pages...`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
    
    // Short timeout to ensure state is updated before printing
    setTimeout(() => {
      handlePrint();
      
      // Reset to original state after print is complete
      setTimeout(() => {
        setPageCount(originalPageCount);
        setIsPreparingDownload(false);
        setShowDownloadDialog(false);
        setDownloadFormat(null);
        
        // Show success message
        setSnackbarMessage('Resume downloaded successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }, 1000);
    }, 800);
  };

  // Function to update page count with content optimization
  const handlePageCountChange = (newPageCount: PageCountType) => {
    // If increasing page count, just update it
    if (newPageCount >= pageCount) {
      setPageCount(newPageCount);
      setAutoOptimized(false);
      return;
    }
    
    // If decreasing page count, check if content needs optimization
    if (contentOverflow) {
      // Show warning that content will be compressed
      setSnackbarMessage(newPageCount === 1 
        ? 'Content will be compressed to fit a single page' 
        : `Content will be compressed to fit ${newPageCount} pages`);
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    }
    
    // Update the page count and set auto-optimized flag
    setPageCount(newPageCount);
    setAutoOptimized(true);
  };

  // Recalculate ATS score on any data change
  useEffect(() => {
    calculateAtsScore();
  }, [resumeData]);

  // Reset auto-optimized flag when switching page count
  useEffect(() => {
    setAutoOptimized(false);
  }, [pageCount]);

  // Add reset function
  const resetResume = () => {
    setResumeData(initialResumeData);
    setTailoredContent('');
    setAtsScore(null);
    setIsFinished(false);
    setAutoOptimized(false);
  };

  // Add function to fill with dummy content
  const fillDummyContent = () => {
    const dummyData: ResumeData = {
      personalInfo: {
        name: 'John Smith',
        linkedin: 'linkedin.com/in/johnsmith',
        location: 'New York, NY',
        email: 'john.smith@example.com',
        mobile: '(555) 123-4567',
      },
      summary: 'Results-driven Software Engineer with 5+ years of experience developing robust web applications using React, Node.js, and TypeScript. Implemented microservices architecture that improved system reliability by 35% and reduced API response times by 28%. Passionate about clean code, performance optimization, and creating exceptional user experiences. Seeking to leverage my technical expertise and problem-solving skills to drive innovation in a collaborative team environment.',
      education: [
        {
          school: 'Massachusetts Institute of Technology',
          degree: 'Master of Science in Computer Science',
          location: 'Cambridge, MA',
          date: '2017 - 2019',
          gpa: '3.85'
        },
        {
          school: 'University of California, Berkeley',
          degree: 'Bachelor of Science in Computer Engineering',
          location: 'Berkeley, CA',
          date: '2013 - 2017',
          gpa: '3.92'
        }
      ],
      skills: {
        'Technical Skills': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'GraphQL', 'REST APIs', 'MongoDB', 'PostgreSQL'],
        'Soft Skills': ['Communication', 'Problem Solving', 'Team Leadership', 'Agile Methodologies', 'Project Management'],
        'Tools & Technologies': ['Git', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jest', 'Webpack'],
      },
      projects: [
        {
          title: 'E-commerce Platform Redesign',
          description: 'Led a team of 5 developers to redesign and modernize a legacy e-commerce platform serving 50,000+ daily users. Implemented a microservices architecture using Node.js and React, resulting in a 40% improvement in page load times and a 25% increase in conversion rates. Integrated authentication system with OAuth 2.0 and implemented robust security measures to protect user data and prevent fraud.',
          tech: 'React, Redux, Node.js, Express, MongoDB, AWS, Docker',
          date: '2021 - 2022',
          inProgress: false
        },
        {
          title: 'Real-time Analytics Dashboard',
          description: 'Designed and developed a real-time analytics dashboard that processes over 1 million events per day. Implemented efficient data aggregation algorithms and visualization components that reduced report generation time by 65%. Created a flexible filtering system allowing users to customize data views according to their specific business needs.',
          tech: 'React, D3.js, GraphQL, PostgreSQL, Redis, WebSockets',
          date: '2020 - 2021',
          inProgress: false
        },
        {
          title: 'AI-Powered Content Management System',
          description: 'Currently developing an AI-powered content management system that uses natural language processing to automatically categorize, tag, and optimize content. Implementing machine learning algorithms to provide content recommendations and performance insights. Building a intuitive user interface with comprehensive analytics and reporting features.',
          tech: 'React, Python, TensorFlow, Flask, PostgreSQL, Docker',
          date: '2022 - Present',
          inProgress: true
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect',
          details: 'Comprehensive certification demonstrating expertise in designing and deploying scalable, fault-tolerant systems on AWS.',
          date: 'September 2021',
          company: 'AWS'
        },
        {
          name: 'Google Professional Cloud Developer',
          details: 'Advanced certification validating skills in building and deploying applications using Google Cloud technologies and best practices.',
          date: 'March 2020',
          company: 'Google'
        }
      ],
      publications: [
        {
          title: 'Optimizing React Performance in Large-Scale Applications',
          details: 'Detailed technical article covering advanced techniques for optimizing React applications, including virtualization, memoization, code splitting, and efficient state management strategies.',
          technologies: 'React, JavaScript, Webpack',
          date: 'July 2021'
        },
        {
          title: 'Microservices Architecture: Practical Implementation Patterns',
          details: 'Research paper examining various implementation patterns for microservices architecture, including data consistency strategies, service discovery methods, and fault tolerance approaches.',
          technologies: 'Node.js, Docker, Kubernetes, Message Queues',
          date: 'November 2020'
        }
      ],
    };

    setResumeData(dummyData);
    setSelectedJobRole('Software Engineer');
    setSelectedTemplate('google');
    // Calculate and set ATS score based on the dummy data
    const newScore = 85;
    setAtsScore(newScore);
    setIsFinished(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Handle cover letter dialog open
  const handleOpenCoverLetterDialog = () => {
    // Pre-fill with data from resume if available
    setCoverLetterData({
      ...coverLetterData,
      senderName: resumeData.personalInfo.name || '',
      senderEmail: resumeData.personalInfo.email || '',
      senderPhone: resumeData.personalInfo.mobile || '',
      senderCity: resumeData.personalInfo.location || '',
      jobTitle: selectedJobRole || '',
    });
    setShowCoverLetterDialog(true);
  };

  // Handle cover letter dialog close
  const handleCloseCoverLetterDialog = () => {
    setShowCoverLetterDialog(false);
  };

  // Update cover letter data
  const handleCoverLetterDataChange = (field: keyof CoverLetterData, value: string) => {
    setCoverLetterData(prev => ({ ...prev, [field]: value }));
  };

  // Generate cover letter based on resume data and job description
  const generateCoverLetter = () => {
    // Gather skills and experience from resume
    const skills = Object.values(resumeData.skills).flat().join(', ');
    const hasEducation = resumeData.education.length > 0;
    const hasProjects = resumeData.projects.length > 0;
    const hasCertifications = resumeData.certifications.length > 0;
    
    // Generate a professional cover letter based on the data
    let content = '';
    
    if (coverLetterData.style === 'pro') {
      content = `I am excited to apply for the ${coverLetterData.jobTitle} position ${coverLetterData.jobId ? `(Requisition ID: ${coverLetterData.jobId})` : ''} in ${coverLetterData.senderCity}. As a ${selectedJobRole || 'professional'} with a specialization in ${skills.split(',')[0]}, I bring a solid foundation in ${skills.split(',').slice(0, 3).join(', ')}, and ${skills.split(',').slice(3, 5).join(', ')}. My hands-on experience with ${hasProjects ? resumeData.projects[0].title : 'various projects'} equips me to monitor, analyze, and safeguard sensitive information effectively.

In my ${hasEducation ? `academic journey at ${resumeData.education[0].school}` : 'professional career'} and project endeavors, I ${hasProjects ? `led the development of ${resumeData.projects[0].title}` : 'have worked on several key initiatives'}, ${hasProjects ? resumeData.projects[0].description : 'demonstrating my technical capabilities'}. Additionally, my experience in ${hasProjects && resumeData.projects.length > 1 ? resumeData.projects[1].title : 'various technical domains'} demonstrates my ability to innovate and implement advanced techniques, ensuring optimal outcomes.

I am particularly drawn to this role's emphasis on proactive measures, analytical thinking, and stakeholder collaboration. With my strong analytical skills and commitment to excellence, I am eager to contribute to ${coverLetterData.recipientCompany}'s mission. I look forward to the opportunity to bring my skills and passion to your team.

Thank you for considering my application. I am excited about the prospect of contributing to your organization's mission and would welcome the opportunity for an interview.`;
    } else {
      content = `I am writing to express my interest in the ${coverLetterData.jobTitle} position at ${coverLetterData.recipientCompany}. With my background in ${selectedJobRole || 'the field'} and expertise in ${skills.split(',').slice(0, 3).join(', ')}, I believe I would be a valuable addition to your team.

Throughout my career, I have developed strong skills in ${skills.split(',').slice(3, 6).join(', ')}. ${hasProjects ? `My work on ${resumeData.projects[0].title} demonstrates my ability to ${resumeData.projects[0].description.substring(0, 100)}...` : 'I have consistently demonstrated my ability to solve complex problems and deliver results.'} ${hasCertifications ? `I have also earned certifications in ${resumeData.certifications.map(cert => cert.name).join(', ')}, which have enhanced my knowledge in these areas.` : ''}

I am impressed by ${coverLetterData.recipientCompany}'s reputation in the industry and would be excited to contribute to your continued success. I am confident that my skills and experiences align well with the requirements of this position.

I look forward to the opportunity to discuss how my qualifications can benefit your team. Thank you for considering my application.`;
    }
    
    setGeneratedCoverLetter(content);
    setCoverLetterData(prev => ({ ...prev, letterContent: content }));
    setShowCoverLetterPreview(true);
  };

  // Toggle cover letter style
  const handleCoverLetterStyleChange = (style: 'normal' | 'pro') => {
    setCoverLetterData(prev => ({ ...prev, style }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App content */}
      <Box sx={{ flex: 1, mb: 4 }}>
    <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Global styles for animations */}
          <style>
            {`
              @keyframes flowingLight {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
          
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          TOP Resume Builder
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#666', mb: 3 }}>
          Create your professional resume in minutes
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        mt: 3
      }}>
        {/* Left Side - Form */}
        <Box sx={{ position: 'sticky', top: 20 }}>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
              Resume Settings
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Font</InputLabel>
                <Select
                  value={selectedFont}
                  label="Font"
                  onChange={(e) => setSelectedFont(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1565c0',
                    },
                  }}
                >
                  {fonts.map((font) => (
                    <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Template</InputLabel>
                <Select
                  value={selectedTemplate}
                  label="Template"
                  onChange={(e) => setSelectedTemplate(e.target.value as typeof selectedTemplate)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1565c0',
                    },
                  }}
                >
                  <MenuItem value="amazon">Amazon Style</MenuItem>
                  <MenuItem value="meta">Meta Style</MenuItem>
                  <MenuItem value="apple">Apple Style</MenuItem>
                  <MenuItem value="google">Google Style</MenuItem>
                  <MenuItem value="microsoft">Microsoft Style</MenuItem>
                  <MenuItem value="custom">Custom Style</MenuItem>
                      <MenuItem value="two-column">Two Column Style</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Job Role</InputLabel>
              <Select
                value={selectedJobRole}
                label="Job Role"
                onChange={(e) => handleJobRoleSelect(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1565c0',
                  },
                }}
              >
                {jobRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Paste Tailored Resume Content"
              value={tailoredContent}
              onChange={handleTailoredContentChange}
              helperText="Paste your resume content in any format"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1565c0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleConvertContent}
                sx={{
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#1565c0' },
                  flex: '1',
                }}
              >
                Convert Content
              </Button>
              <Button
                variant="contained"
                onClick={handleFinish}
                sx={{
                  backgroundColor: isFinished ? '#4caf50' : '#f44336',
                  '&:hover': { 
                    backgroundColor: isFinished ? '#388e3c' : '#d32f2f' 
                  },
                  flex: '1',
                }}
              >
                {isFinished ? `Your ATS Score: ${atsScore}%` : 'Finish Resume'}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={resetResume}
                sx={{
                  borderColor: '#ff9800',
                  color: '#ff9800',
                  '&:hover': { 
                    borderColor: '#ed6c02',
                    backgroundColor: 'rgba(255, 152, 0, 0.04)'
                  },
                  flex: '1',
                }}
              >
                Reset Resume
              </Button>
              <Button
                variant="outlined"
                onClick={fillDummyContent}
                sx={{
                  borderColor: '#2196f3',
                  color: '#2196f3',
                  '&:hover': { 
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(33, 150, 243, 0.04)'
                  },
                  flex: '1',
                }}
              >
                Fill Dummy
              </Button>
              <Button
                variant="outlined"
                onClick={handleOpenCoverLetterDialog}
                sx={{
                  borderColor: '#4caf50',
                  color: '#4caf50',
                  '&:hover': { 
                    borderColor: '#388e3c',
                    backgroundColor: 'rgba(76, 175, 80, 0.04)'
                  },
                  flex: '1',
                }}
              >
                Cover Letter
              </Button>
            </Box>
          </Paper>

              <ResumeForm 
                data={resumeData} 
                onUpdate={setResumeData} 
                selectedJobRole={selectedJobRole}
                skillSuggestions={skillSuggestions}
                onOpenSkillSuggestions={handleOpenSkillSuggestions}
              />
        </Box>

        {/* Right Side - Preview */}
        <Box sx={{ position: 'sticky', top: 20 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {/* ATS Score Display */}
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              backgroundColor: '#f8fbff',
              borderRadius: '8px 8px 0 0'
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 1,
                borderRadius: 1,
                p: 1,
                backgroundColor: 'rgba(25, 118, 210, 0.05)',
                border: '1px solid rgba(25, 118, 210, 0.1)'
              }}>
                <Typography variant="body2" fontWeight="medium" sx={{ color: '#1976d2' }}>
                  ATS Compatibility Score
                </Typography>
                <Typography 
                  variant="body2" 
                  fontWeight="bold" 
                  sx={{ 
                    color: atsScore === null ? 'text.secondary' : 
                          atsScore > 70 ? '#4caf50' : 
                          atsScore > 40 ? '#ff9800' : '#f44336',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    transition: 'color 0.5s ease-in-out'
                  }}
                >
                  {atsScore !== null && (
                    <span 
                      role="img" 
                      aria-label={atsScore > 70 ? "good" : atsScore > 40 ? "warning" : "poor"}
                    >
                      {atsScore > 70 ? '✅' : atsScore > 40 ? '⚠️' : '❌'}
                    </span>
                  )}
                  {atsScore === null ? 'Not calculated' : `${atsScore}%`}
                </Typography>
              </Box>
              
              {/* Animated progress bar */}
              <Box sx={{ width: '100%' }}>
                <Box 
                  sx={{ 
                    height: 10, 
                    width: '100%', 
                    bgcolor: 'rgba(0, 0, 0, 0.06)',
                    borderRadius: 5,
                    overflow: 'hidden',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.03)'
                  }}
                >
                  <Box 
                    sx={{ 
                      height: '100%', 
                      width: `${atsScore || 0}%`, 
                      bgcolor: atsScore && atsScore > 70 ? '#4caf50' : 
                             atsScore && atsScore > 40 ? '#ff9800' : 
                             '#f44336',
                      transition: 'width 1s ease-in-out'
                    }} 
                  />
                </Box>
              </Box>
              
              {/* Score breakdown */}
              {atsScore !== null && (
                <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Incomplete
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Excellent
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              p: 2,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              gap: 1.5, 
            }}>
              <Button
                variant="contained"
                onClick={handleOpenDownloadDialog}
                startIcon={<span role="img" aria-label="download">📥</span>}
                sx={{
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#1565c0' },
                  flexGrow: 1
                }}
              >
                Download PDF
              </Button>
              <Button
                variant="outlined"
                onClick={handleDownloadJSON}
                sx={{
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  '&:hover': { 
                    borderColor: '#1565c0',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  '&:hover': {
                    borderColor: '#1565c0',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                Open
                <input
                  type="file"
                  hidden
                  accept=".json"
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>

            {/* Resume Render Area */}
            <Box sx={{ 
              p: 2, 
              maxHeight: '70vh', 
              overflow: 'auto',
              position: 'relative' 
            }}>
              {/* Bottom Overflow Warning */}
              {contentOverflow && (
                <Box sx={{ 
                  position: 'sticky', 
                  bottom: 0, 
                  width: '100%',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 244, 229, 0.9)',
                  color: '#ed6c02',
                  p: 1,
                  fontSize: '0.85rem',
                  fontWeight: 'medium',
                  borderRadius: '4px',
                  border: '1px solid rgba(237, 108, 2, 0.2)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 10,
                  mb: 1,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  Content exceeds {pageCount} {pageCount === 1 ? 'page' : 'pages'} - {pageCount < 5 ? `Switch to ${pageCount + 1} pages or ` : ''}reduce content
              </Box>
              )}

              {/* Page Count Selector */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mb: 2,
                gap: 1.5
              }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Pages:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[1, 2, 3, 4, 5].map((count) => (
                    <Box 
                      key={count}
                      onClick={() => handlePageCountChange(count as PageCountType)}
                      sx={{
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${count === pageCount ? '#1976d2' : 'rgba(0,0,0,0.12)'}`,
                        borderRadius: '4px',
                        backgroundColor: count === pageCount ? 'rgba(25, 118, 210, 0.1)' : 'white',
                        color: count === pageCount ? '#1976d2' : 'text.secondary',
                        fontWeight: count === pageCount ? 'bold' : 'normal',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#1976d2',
                          backgroundColor: count === pageCount ? 'rgba(25, 118, 210, 0.15)' : 'rgba(25, 118, 210, 0.05)',
                        }
                      }}
                    >
                      {count}
                    </Box>
                  ))}
                </Box>
                {contentOverflow && pageCount < 5 && (
                  <Button 
                    size="small"
                    variant="text"
                    onClick={() => handlePageCountChange(Math.min(5, pageCount + 1) as PageCountType)}
                    sx={{ 
                      minWidth: 'auto', 
                      p: 0.5, 
                      fontSize: '0.75rem',
                      color: '#1976d2',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.05)',
                      }
                    }}
                  >
                    Add page
                  </Button>
                )}
              </Box>

              <Box ref={resumeRef}>
                <Resume
                  data={resumeData} 
                  fontFamily={selectedFont}
                  template={selectedTemplate}
                  pageCount={pageCount}
                  onPageOverflow={handlePageOverflow}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

          {/* Skill Suggestions Dialog */}
          <Dialog 
            open={showSkillSuggestions} 
            onClose={handleCloseSkillSuggestions}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
              }
            }}
          >
            <DialogTitle sx={{ 
              background: 'linear-gradient(135deg, #1976d2, #2196f3)',
              color: 'white',
              py: 2.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <span role="img" aria-label="suggestions" style={{ fontSize: '1.5rem' }}>💡</span>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Suggested Skills for {skillSuggestionCategory}
                </Typography>
              </Box>
              <IconButton 
                onClick={handleCloseSkillSuggestions}
                sx={{ color: 'white' }}
              >
                <span role="img" aria-label="close">✕</span>
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ px: 3, py: 3, bgcolor: '#f8fbff' }}>
              <Box sx={{ 
                mb: 3, 
                p: 2, 
                borderRadius: 2, 
                bgcolor: 'rgba(25, 118, 210, 0.08)', 
                border: '1px solid rgba(25, 118, 210, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Box sx={{ 
                  bgcolor: 'rgba(25, 118, 210, 0.15)', 
                  borderRadius: '50%', 
                  p: 1.2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#1976d2',
                  fontSize: '1.4rem'
                }}>
                  <span role="img" aria-label="info">ℹ️</span>
                </Box>
                <Typography variant="body2" color="#1976d2" sx={{ flex: 1 }}>
                  Select skills that are relevant to the <strong>{selectedJobRole || "selected"}</strong> role. 
                  These skills will help improve your resume's ATS compatibility score.
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#424242' }}>
                Recommended Skills:
              </Typography>
              
              <Box sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                mb: 4,
                maxHeight: '300px',
                overflowY: 'auto',
                p: 1,
                borderRadius: 1,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#bbdefb',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#90caf9',
                  },
                },
              }}>
                {selectedJobRole && skillSuggestions && skillSuggestions[selectedJobRole] ? (
                  skillSuggestions[selectedJobRole].map((skill, index) => {
                    const isSelected = selectedSkills.includes(skill);
                    const isInResume = resumeData.skills[skillSuggestionCategory]?.includes(skill);
                    
                    return (
                      <Chip
                        key={index}
                        label={skill}
                        onClick={() => !isInResume && handleToggleSkill(skill)}
                        sx={{
                          borderRadius: '40px',
                          border: `2px solid ${
                            isInResume ? '#4caf50' : 
                            isSelected ? '#1976d2' : 
                            'rgba(0, 0, 0, 0.12)'
                          }`,
                          backgroundColor: isInResume ? 'rgba(76, 175, 80, 0.1)' : 
                                        isSelected ? 'rgba(25, 118, 210, 0.1)' : 'white',
                          color: isInResume ? '#2e7d32' : 
                                isSelected ? '#1565c0' : 
                                '#424242',
                          px: 1,
                          py: 2.5,
                          fontWeight: isSelected || isInResume ? 'bold' : 'normal',
                          cursor: isInResume ? 'default' : 'pointer',
                          boxShadow: isSelected || isInResume ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: isInResume ? 'rgba(76, 175, 80, 0.1)' : 
                                            isSelected ? 'rgba(25, 118, 210, 0.15)' : 
                                            'rgba(0, 0, 0, 0.04)',
                            transform: isInResume ? 'none' : 'translateY(-2px)',
                            boxShadow: isInResume ? '0 2px 4px rgba(0,0,0,0.05)' : '0 4px 8px rgba(0,0,0,0.1)'
                          },
                          '& .MuiChip-label': {
                            px: 1,
                            py: 0.5
                          }
                        }}
                        avatar={
                          isInResume ? (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              marginRight: '4px',
                              marginLeft: '4px',
                              color: '#2e7d32'
                            }}>
                              <span role="img" aria-label="already added">✓</span>
                            </div>
                          ) : isSelected ? (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              marginRight: '4px',
                              marginLeft: '4px',
                              color: '#1565c0'
                            }}>
                              <span role="img" aria-label="selected">✓</span>
                            </div>
                          ) : undefined
                        }
                      />
                    );
                  })
                ) : (
                  <Box sx={{ 
                    width: '100%', 
                    textAlign: 'center', 
                    py: 4, 
                    bgcolor: 'white', 
                    borderRadius: 2,
                    border: '1px dashed rgba(0, 0, 0, 0.12)'
                  }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      No skill suggestions available for this job role.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Please select a different job role to see recommendations.
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'space-between'
              }}>
                <Box sx={{ 
                  flex: 1,
                  minWidth: '250px',
                  p: 2, 
                  borderRadius: 2,
                  border: '1px solid rgba(25, 118, 210, 0.2)',
                  bgcolor: 'white'
                }}>
                  <Typography variant="subtitle2" color="#1976d2" sx={{ 
                    mb: 1, 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <span role="img" aria-label="legend">🔍</span>
                    Legend
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        size="small" 
                        label="Example Skill" 
                        sx={{ 
                          borderRadius: '40px',
                          border: '2px solid rgba(0, 0, 0, 0.12)',
                          bgcolor: 'white'
                        }} 
                      />
                      <Typography variant="body2" color="text.secondary">Available skill</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        size="small" 
                        label="Selected Skill" 
                        avatar={<div style={{ marginLeft: '4px' }}><span role="img">✓</span></div>}
                        sx={{ 
                          borderRadius: '40px',
                          border: '2px solid #1976d2',
                          bgcolor: 'rgba(25, 118, 210, 0.1)',
                          color: '#1565c0',
                          fontWeight: 'bold'
                        }} 
                      />
                      <Typography variant="body2" color="text.secondary">Will be added to resume</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        size="small" 
                        label="Existing Skill" 
                        avatar={<div style={{ marginLeft: '4px', color: '#2e7d32' }}><span role="img">✓</span></div>}
                        sx={{ 
                          borderRadius: '40px',
                          border: '2px solid #4caf50',
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          color: '#2e7d32',
                          fontWeight: 'bold'
                        }} 
                      />
                      <Typography variant="body2" color="text.secondary">Already in your resume</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  flex: 1,
                  minWidth: '250px',
                  p: 2, 
                  borderRadius: 2,
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  bgcolor: 'rgba(76, 175, 80, 0.05)'
                }}>
                  <Typography variant="subtitle2" color="#2e7d32" sx={{ 
                    mb: 1, 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1 
                  }}>
                    <span role="img" aria-label="tips">✅</span>
                    Selection Tips
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2e7d32', mb: 1 }}>
                    • Choose skills that match your actual experience
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2e7d32', mb: 1 }}>
                    • Include both technical and soft skills
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2e7d32' }}>
                    • Skills with higher relevance improve ATS score
                  </Typography>
                </Box>
              </Box>
        </DialogContent>
            
            <DialogActions sx={{ 
              p: 2, 
              borderTop: '1px solid rgba(0,0,0,0.08)',
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                {selectedSkills.length > 0 
                  ? `${selectedSkills.length} skill${selectedSkills.length > 1 ? 's' : ''} selected` 
                  : 'Click skills to select them'}
              </Typography>
              <Box>
                <Button 
                  onClick={handleCloseSkillSuggestions} 
                  variant="outlined"
                  sx={{
                    borderColor: '#9e9e9e',
                    color: '#616161',
                    mr: 1,
                    '&:hover': {
                      borderColor: '#757575',
                      bgcolor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Cancel
          </Button>
                <Button 
                  onClick={handleAddSelectedSkills}
                  variant="contained"
                  disabled={selectedSkills.length === 0}
                  startIcon={<span role="img" aria-label="add">➕</span>}
                  sx={{
                    bgcolor: '#1976d2',
                    '&:hover': {
                      bgcolor: '#1565c0'
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(25, 118, 210, 0.3)',
                      color: 'white'
                    }
                  }}
                >
                  Add Selected
                </Button>
              </Box>
        </DialogActions>
      </Dialog>

          {/* ATS Score Feedback Dialog - Redesigned for professional look */}
      <Dialog 
        open={showAtsFeedback} 
        onClose={handleCloseAtsFeedback}
            maxWidth="md"
        fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              }
            }}
          >
            <Box sx={{ 
              position: 'relative',
              borderLeft: atsScore && atsScore > 70 ? '4px solid #4caf50' : 
                         atsScore && atsScore > 40 ? '4px solid #ff9800' : 
                         '4px solid #f44336',
            }}>
              <DialogTitle sx={{ 
                backgroundColor: '#f8fbff', 
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2.5
              }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1565c0' }}>
          ATS Score Analysis
                </Typography>
                <Button 
                  onClick={handleCloseAtsFeedback} 
                  variant="text" 
                  sx={{ 
                    minWidth: 'auto', 
                    p: 1, 
                    color: 'rgba(0,0,0,0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.05)',
                    }
                  }}
                >
                  ✕
                </Button>
        </DialogTitle>

              <DialogContent sx={{ px: 0, py: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100%' }}>
                  {/* Score Display Section */}
                  <Box sx={{ 
                    flex: '0 0 250px',
                    backgroundColor: '#f8fbff',
                    borderRight: '1px solid rgba(0,0,0,0.08)',
                    borderBottom: { xs: '1px solid rgba(0,0,0,0.08)', md: 'none' },
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    textAlign: 'center'
                  }}>
                    {/* Score Circle */}
                    <Box sx={{ 
                      position: 'relative',
                      width: '180px',
                      height: '180px',
                      borderRadius: '50%',
                      background: atsScore !== null ? (
                        atsScore > 70 ? 
                          'conic-gradient(#4caf50 0% ' + atsScore + '%, #e0e0e0 ' + atsScore + '% 100%)' : 
                        atsScore > 40 ? 
                          'conic-gradient(#ff9800 0% ' + atsScore + '%, #e0e0e0 ' + atsScore + '% 100%)' :
                          'conic-gradient(#f44336 0% ' + atsScore + '%, #e0e0e0 ' + atsScore + '% 100%)'
                      ) : '#e0e0e0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 1.5s ease-in-out',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        bottom: '10px',
                        left: '10px',
                        borderRadius: '50%',
                        background: 'white',
                        zIndex: 1
                      }
                    }}>
                      <Box sx={{
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}>
                        <Typography variant="h3" fontWeight="bold" sx={{ 
                          color: atsScore && atsScore > 70 ? '#4caf50' : 
                                atsScore && atsScore > 40 ? '#ff9800' : '#f44336',
                          transition: 'color 0.5s ease-in-out'
            }}>
              {atsScore}%
            </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'text.secondary',
                          fontWeight: 500,
                          letterSpacing: 0.5,
                          textTransform: 'uppercase'
                        }}>
                          ATS Score
            </Typography>
                      </Box>
                    </Box>
                    
                    {/* Status Text */}
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ 
                        color: atsScore && atsScore > 70 ? '#4caf50' : 
                              atsScore && atsScore > 40 ? '#ff9800' : '#f44336',
                        transition: 'color 0.5s ease-in-out',
                        mb: 0.5
                      }}>
                        {atsScore && atsScore > 70 ? 'Excellent Score!' : 
                        atsScore && atsScore > 40 ? 'Good Progress' : 'Needs Improvement'}
              </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '220px' }}>
                        {atsScore && atsScore > 70 
                          ? 'Your resume is well-optimized for ATS systems.'
                          : 'Follow the suggestions to improve your ATS compatibility.'}
              </Typography>
                    </Box>
                  </Box>

                  {/* Details Section */}
                  <Box sx={{ 
                    flex: 1, 
                    p: 3, 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 3,
                    overflow: 'auto'
                  }}>
                    {/* Score Breakdown */}
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2, 
                          color: '#1976d2',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <span role="img" aria-label="breakdown" style={{ fontSize: '1.2rem' }}>📊</span>
                        Score Breakdown
              </Typography>
                      
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        {[
                          { name: 'Skills & Keywords', value: 35, score: Math.min(100, (Object.values(resumeData.skills).flat().length / 15) * 100) },
                          { name: 'Project Experience', value: 20, score: Math.min(100, (resumeData.projects.length / 3) * 100) },
                          { name: 'Education Details', value: 15, score: resumeData.education.length > 0 ? 100 : 0 },
                          { name: 'Certifications', value: 10, score: Math.min(100, (resumeData.certifications.length / 2) * 100) },
                          { name: 'Summary Quality', value: 10, score: resumeData.summary.length > 100 ? 100 : (resumeData.summary.length / 100) * 100 },
                          { name: 'Contact Info', value: 10, score: (resumeData.personalInfo.name ? 20 : 0) + (resumeData.personalInfo.email ? 20 : 0) + (resumeData.personalInfo.mobile ? 20 : 0) + (resumeData.personalInfo.location ? 20 : 0) + (resumeData.personalInfo.linkedin ? 20 : 0) }
                        ].map((item, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              border: '1px solid rgba(0,0,0,0.08)', 
                              borderRadius: 1,
                              p: 1.5,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 0.5
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" fontWeight="medium">
                                {item.name}
              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'white', 
                                  bgcolor: item.score > 70 ? '#4caf50' : item.score > 40 ? '#ff9800' : '#f44336',
                                  px: 1,
                                  py: 0.2,
                                  borderRadius: 1,
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold'
                                }}
                              >
                                {item.value}%
              </Typography>
                          </Box>
                          <Box 
                            sx={{ 
                              height: 6, 
                              bgcolor: '#f0f0f0',
                              borderRadius: 3,
                              overflow: 'hidden'
                            }}
                          >
                            <Box 
                              sx={{ 
                                height: '100%', 
                                width: `${item.score}%`, 
                                bgcolor: item.score > 70 ? '#4caf50' : item.score > 40 ? '#ff9800' : '#f44336',
                                transition: 'width 1s ease-in-out'
                              }} 
                            />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
              </Box>
          </Box>
        </DialogContent>

          <DialogActions sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(0,0,0,0.08)',
            backgroundColor: '#f8fbff'
          }}>
            <Button 
              onClick={handleCloseAtsFeedback} 
              variant="contained"
              sx={{
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0'
                },
                px: 3
              }}
            >
            Close
          </Button>
            <Button 
              onClick={() => {
                handleCloseAtsFeedback();
                // Scroll to the form section for editing
                document.querySelector('.MuiContainer-root')?.scrollIntoView({ behavior: 'smooth' });
              }} 
              variant="outlined"
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  borderColor: '#1565c0',
                  bgcolor: 'rgba(25, 118, 210, 0.04)'
                },
                px: 3
              }}
            >
              Edit Resume
          </Button>
        </DialogActions>
        </Box>
      </Dialog>

      {/* Download Format Dialog */}
      <Dialog 
        open={showDownloadDialog} 
        onClose={handleCloseDownloadDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#f8fbff', 
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          py: 2.5
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1565c0' }}>
            Download Resume
              </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ px: 3, py: 3 }}>
          {isPreparingDownload ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Preparing your resume...
              </Typography>
              <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ 
                  width: 40,
                  height: 40,
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #1976d2',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}/>
            </Box>
              <Typography variant="body2" color="text.secondary">
                {downloadFormat === 1 
                  ? 'Optimizing content for single page format...' 
                  : `Preparing ${downloadFormat}-page document...`}
                </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Choose your preferred resume format:
                </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {/* Single Page Option */}
                <Paper 
                  elevation={0} 
                  onClick={() => handleOptimizedPrint(1)}
                  sx={{ 
                    p: 2, 
                    border: '1px solid rgba(0,0,0,0.12)', 
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#1976d2',
                      boxShadow: '0 0 0 1px #1976d2',
                      bgcolor: 'rgba(25, 118, 210, 0.04)'
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Box sx={{ 
                    width: 100, 
                    height: 140, 
                    bgcolor: 'white',
                    border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 0.5
                  }}>
                    <Box sx={{ height: '15%', bgcolor: '#1976d2', mb: 0.5, borderRadius: '2px 2px 0 0' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                      {[...Array(6)].map((_, i) => (
                        <Box key={i} sx={{ height: '2px', bgcolor: '#e0e0e0', width: '90%', mx: 'auto' }} />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      Single Page
                </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {contentOverflow 
                        ? "Content will be optimized to fit one page" 
                        : "All content fits on one page"}
                </Typography>
                  </Box>
                </Paper>
                
                {/* Multi-Page Option with Dynamic Page Count Selector */}
                <Box sx={{
                  border: '1px solid rgba(0,0,0,0.12)', 
                  borderRadius: 2,
                  p: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#1976d2',
                    boxShadow: '0 0 0 1px #1976d2',
                    bgcolor: 'rgba(25, 118, 210, 0.04)'
                  },
                }}>
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      position: 'relative',
                      width: 100,
                      height: 110
                    }}>
                      {[...Array(3)].map((_, i) => (
                        <Box 
                          key={i} 
                          sx={{ 
                            width: 80, 
                            height: 100, 
                            bgcolor: 'white',
                            border: '1px solid rgba(0,0,0,0.12)',
                            borderRadius: 1,
                            position: 'absolute',
                            top: i * 10,
                            left: i * 10,
                            display: 'flex',
                            flexDirection: 'column',
                            p: 0.5,
                            zIndex: 3 - i
                          }}
                        >
                          <Box sx={{ height: '15%', bgcolor: '#1976d2', mb: 0.5, borderRadius: '2px 2px 0 0' }} />
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                            {[...Array(4)].map((_, j) => (
                              <Box key={j} sx={{ height: '2px', bgcolor: '#e0e0e0', width: '90%', mx: 'auto' }} />
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    
                    <Box sx={{ textAlign: 'center', width: '100%' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                        Multiple Pages
                </Typography>
                      
                      {/* Page count selector */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                        {[2, 3, 4, 5].map((count) => (
                          <Box 
                            key={count}
                            onClick={() => handleOptimizedPrint(count as PageCountType)}
                            sx={{
                              width: 28,
                              height: 28,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `1px solid ${count === (contentOverflow ? Math.min(5, pageCount + 1) : pageCount) ? '#1976d2' : 'rgba(0,0,0,0.12)'}`,
                              borderRadius: '50%',
                              backgroundColor: count === (contentOverflow ? Math.min(5, pageCount + 1) : pageCount) ? 'rgba(25, 118, 210, 0.1)' : 'white',
                              color: count === (contentOverflow ? Math.min(5, pageCount + 1) : pageCount) ? '#1976d2' : 'text.secondary',
                              fontWeight: count === (contentOverflow ? Math.min(5, pageCount + 1) : pageCount) ? 'bold' : 'normal',
                              cursor: 'pointer',
                              '&:hover': {
                                borderColor: '#1976d2',
                                backgroundColor: count === (contentOverflow ? Math.min(5, pageCount + 1) : pageCount) ? 'rgba(25, 118, 210, 0.15)' : 'rgba(25, 118, 210, 0.05)',
                              }
                            }}
                          >
                            {count}
              </Box>
                        ))}
          </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {contentOverflow 
                          ? `Content will be distributed across pages` 
                          : `Spreads content for better readability`}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              {contentOverflow && (
                <Box sx={{ 
                  mt: 3, 
                  p: 2, 
                  borderLeft: '3px solid #ff9800',
                  bgcolor: 'rgba(255, 152, 0, 0.05)',
                  borderRadius: '0 4px 4px 0'
                }}>
                  <Typography variant="body2" color="warning.dark">
                    <strong>Note:</strong> {pageCount === 1 
                      ? 'Your content exceeds one page. Choosing single-page will automatically adjust font size and spacing to fit.'
                      : `Your content exceeds ${pageCount} pages. Automatic optimization will adjust font size and spacing to fit your content.`}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        
        {!isPreparingDownload && (
          <DialogActions sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(0,0,0,0.08)',
            backgroundColor: '#f8fbff'
          }}>
            <Button 
              onClick={handleCloseDownloadDialog} 
              variant="outlined"
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  borderColor: '#1565c0',
                  bgcolor: 'rgba(25, 118, 210, 0.04)'
                },
                px: 3
              }}
            >
              Cancel
          </Button>
        </DialogActions>
        )}
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Add Cover Letter Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => handlePrint()}
          sx={{
            backgroundColor: '#4caf50',
            '&:hover': { backgroundColor: '#388e3c' },
            px: 4
          }}
        >
          Download Resume
        </Button>
      </Box>
    </Container>
  </Box>

  {/* Footer with copyright */}
  <Box
    component="footer"
    sx={{
      py: 2,
      px: 2, 
      mt: 'auto',
      backgroundColor: '#f5f5f5',
      borderTop: '1px solid #e0e0e0',
      textAlign: 'center'
    }}
  >
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} Resume Builder by Hacx Singh. All rights reserved.
    </Typography>
  </Box>

  {/* Cover Letter Dialog */}
  <Dialog 
    open={showCoverLetterDialog} 
    onClose={handleCloseCoverLetterDialog}
    maxWidth="md"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(76, 175, 80, 0.2)',
      }
    }}
  >
    <DialogTitle sx={{ 
      background: 'linear-gradient(135deg, #4caf50, #81c784)',
      color: 'white',
      py: 2.5,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <span role="img" aria-label="cover letter" style={{ fontSize: '1.5rem' }}>📝</span>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Create Professional Cover Letter
        </Typography>
      </Box>
      <IconButton 
        onClick={handleCloseCoverLetterDialog}
        sx={{ color: 'white' }}
      >
        <span role="img" aria-label="close">✕</span>
      </IconButton>
    </DialogTitle>
    
    <DialogContent sx={{ px: 3, py: 3 }}>
      {coverLetterPreview ? (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setShowCoverLetterPreview(false)}
              sx={{ borderColor: '#1976d2', color: '#1976d2' }}
            >
              Edit
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handlePrintCoverLetter()}
              sx={{ bgcolor: '#1976d2' }}
            >
              Download
            </Button>
          </Box>
          
          {/* Cover Letter Preview */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              maxHeight: '60vh', 
              overflow: 'auto',
              bgcolor: coverLetterData.style === 'pro' ? '#282828' : 'white',
              color: coverLetterData.style === 'pro' ? 'white' : 'inherit',
            }}
            ref={coverLetterRef}
          >
            {/* Sender Info - Top Left */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Box>
                {coverLetterData.style === 'pro' && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" sx={{ 
                      textTransform: 'uppercase', 
                      fontWeight: 'bold',
                      color: coverLetterData.style === 'pro' ? '#2196f3' : 'inherit'
                    }}>
                      {coverLetterData.senderName}
                    </Typography>
                    <Typography sx={{ 
                      color: coverLetterData.style === 'pro' ? '#2196f3' : 'inherit',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                    }}>
                      {selectedJobRole || 'Professional'}
                    </Typography>
                  </Box>
                )}
                
                {coverLetterData.style === 'normal' && (
                  <>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {coverLetterData.senderName}
                    </Typography>
                    <Typography>
                      {coverLetterData.senderAddress}
                    </Typography>
                    <Typography>
                      {coverLetterData.senderCity}
                    </Typography>
                    <Typography>
                      {coverLetterData.senderPhone}
                    </Typography>
                    <Typography>
                      {coverLetterData.senderEmail}
                    </Typography>
                  </>
                )}
              </Box>
              
              {/* Date - Top Right */}
              <Box>
                <Typography>
                  {coverLetterData.date}
                </Typography>
              </Box>
            </Box>
            
            {/* Horizontal Line for Pro Style */}
            {coverLetterData.style === 'pro' && (
              <Box sx={{ 
                width: '100%', 
                height: '2px', 
                bgcolor: '#2196f3', 
                mb: 3 
              }} />
            )}
            
            {/* Recipient Info */}
            <Box sx={{ mb: 3 }}>
              <Typography>
                {coverLetterData.recipientName}
              </Typography>
              <Typography>
                {coverLetterData.recipientCompany}
              </Typography>
              <Typography>
                {coverLetterData.senderCity}
              </Typography>
            </Box>
            
            {/* Greeting */}
            <Box sx={{ mb: 2 }}>
              <Typography>
                Dear {coverLetterData.recipientName},
              </Typography>
            </Box>
            
            {/* Cover Letter Content */}
            <Box sx={{ mb: 3 }}>
              {coverLetterData.letterContent.split('\n\n').map((paragraph, index) => (
                <Typography key={index} sx={{ mb: 2, textAlign: 'justify' }}>
                  {paragraph}
                </Typography>
              ))}
            </Box>
            
            {/* Closing */}
            <Box>
              <Typography sx={{ mb: 2 }}>
                Sincerely,
              </Typography>
              <Typography sx={{ fontWeight: 'bold' }}>
                {coverLetterData.senderName}
              </Typography>
              {coverLetterData.style === 'pro' ? (
                <Typography>
                  {coverLetterData.senderCity}
                </Typography>
              ) : null}
              <Typography>
                {coverLetterData.senderEmail}
              </Typography>
              {coverLetterData.style === 'pro' && (
                <Typography>
                  {coverLetterData.senderPhone}
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      ) : (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
              Choose Cover Letter Style
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Normal Style Option */}
              <Paper 
                elevation={coverLetterData.style === 'normal' ? 3 : 1}
                onClick={() => handleCoverLetterStyleChange('normal')}
                sx={{ 
                  p: 2, 
                  flex: 1, 
                  cursor: 'pointer',
                  border: coverLetterData.style === 'normal' ? '2px solid #2196f3' : '1px solid #e0e0e0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#2196f3',
                  }
                }}
              >
                <Box sx={{ height: 140, mb: 2, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                  <img 
                    src="https://i.imgur.com/QUPlEAZ.png" 
                    alt="Normal cover letter style"
                    style={{ 
                      width: '80%', 
                      objectFit: 'cover', 
                      borderRadius: 4,
                      border: '1px solid #e0e0e0' 
                    }}
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                  Normal Style
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  Traditional, clean layout with standard formatting
                </Typography>
              </Paper>
              
              {/* Pro Style Option */}
              <Paper 
                elevation={coverLetterData.style === 'pro' ? 3 : 1}
                onClick={() => handleCoverLetterStyleChange('pro')}
                sx={{ 
                  p: 2, 
                  flex: 1, 
                  cursor: 'pointer',
                  border: coverLetterData.style === 'pro' ? '2px solid #2196f3' : '1px solid #e0e0e0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#2196f3',
                  }
                }}
              >
                <Box sx={{ height: 140, mb: 2, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                  <img 
                    src="https://i.imgur.com/mAjnUo3.png" 
                    alt="Pro cover letter style"
                    style={{ 
                      width: '80%', 
                      objectFit: 'cover', 
                      borderRadius: 4,
                      border: '1px solid #e0e0e0' 
                    }}
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                  Pro Style
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  Modern design with accent colors and strategic formatting
                </Typography>
              </Paper>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Recipient Info */}
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
              Recipient Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Company Name"
                value={coverLetterData.recipientCompany}
                onChange={(e) => handleCoverLetterDataChange('recipientCompany', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Recipient Name"
                value={coverLetterData.recipientName}
                onChange={(e) => handleCoverLetterDataChange('recipientName', e.target.value)}
                placeholder="Hiring Manager"
              />
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Job Title"
                value={coverLetterData.jobTitle}
                onChange={(e) => handleCoverLetterDataChange('jobTitle', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Job ID (Optional)"
                value={coverLetterData.jobId || ''}
                onChange={(e) => handleCoverLetterDataChange('jobId', e.target.value)}
              />
            </Box>
            
            {/* Sender Info */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>
              Your Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Your Name"
                value={coverLetterData.senderName}
                onChange={(e) => handleCoverLetterDataChange('senderName', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Your Address"
                value={coverLetterData.senderAddress}
                onChange={(e) => handleCoverLetterDataChange('senderAddress', e.target.value)}
              />
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                label="City, State"
                value={coverLetterData.senderCity}
                onChange={(e) => handleCoverLetterDataChange('senderCity', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Email"
                value={coverLetterData.senderEmail}
                onChange={(e) => handleCoverLetterDataChange('senderEmail', e.target.value)}
                required
              />
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Phone"
                value={coverLetterData.senderPhone}
                onChange={(e) => handleCoverLetterDataChange('senderPhone', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Date"
                value={coverLetterData.date}
                onChange={(e) => handleCoverLetterDataChange('date', e.target.value)}
              />
            </Box>
          </Box>
        </Box>
      )}
    </DialogContent>
    
    <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
      {!coverLetterPreview ? (
        <>
          <Button 
            onClick={handleCloseCoverLetterDialog}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={generateCoverLetter}
            sx={{ 
              bgcolor: '#1976d2',
              '&:hover': { bgcolor: '#1565c0' } 
            }}
            disabled={!coverLetterData.recipientCompany || !coverLetterData.jobTitle || !coverLetterData.senderName || !coverLetterData.senderEmail || !coverLetterData.senderPhone}
          >
            Generate Cover Letter
          </Button>
        </>
      ) : null}
    </DialogActions>
  </Dialog>
</Box>
  );
}

export default App;
