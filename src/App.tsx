import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Button, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Snackbar, Alert, Paper, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Chip, GlobalStyles, IconButton, Grid } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import Resume from './components/Resume';
import ResumeForm from './components/ResumeForm';
import { ResumeData } from './components/Resume';

// Define page count type to be used throughout the app
type PageCountType = 1 | 2 | 3 | 4 | 5;

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
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: 'Resume',
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
    
    // Short timeout to ensure state is updated before printing
    setTimeout(() => {
      handlePrint();
      
      // Reset to original state after print is complete
      setTimeout(() => {
        setPageCount(originalPageCount);
        setIsPreparingDownload(false);
        setShowDownloadDialog(false);
        setDownloadFormat(null);
      }, 1000);
    }, 500);
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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
                    }}
                  >
                    {isFinished ? `Your ATS Score: ${atsScore}%` : 'Finish Resume'}
                  </Button>
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
                    }}
                  >
                    Reset Resume
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
                        ? "Content will be condensed to fit one page" 
                        : "All content fits on one page"}
                    </Typography>
                  </Box>
                </Paper>
                
                {/* Multi-Page Option */}
                <Paper 
                  elevation={0}
                  onClick={() => handleOptimizedPrint(contentOverflow 
                    ? Math.min(5, pageCount + 1 > 5 ? 5 : (pageCount + 1)) as PageCountType 
                    : pageCount)}
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
                    display: 'flex',
                    position: 'relative',
                    width: 100,
                    height: 140
                  }}>
                    {[...Array(3)].map((_, i) => (
                      <Box 
                        key={i} 
                        sx={{ 
                          width: 80, 
                          height: 120, 
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
                          {[...Array(5)].map((_, j) => (
                            <Box key={j} sx={{ height: '2px', bgcolor: '#e0e0e0', width: '90%', mx: 'auto' }} />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      Multiple Pages
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {contentOverflow 
                        ? `Will use ${Math.min(5, pageCount + 1)} pages to fit all content` 
                        : `Will use ${pageCount} page${pageCount > 1 ? 's' : ''}`}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
              
              {contentOverflow && pageCount === 1 && (
                <Box sx={{ 
                  mt: 3, 
                  p: 2, 
                  borderLeft: '3px solid #ff9800',
                  bgcolor: 'rgba(255, 152, 0, 0.05)',
                  borderRadius: '0 4px 4px 0'
                }}>
                  <Typography variant="body2" color="warning.dark">
                    <strong>Note:</strong> Your content exceeds one page. Choosing single-page will automatically adjust font size and trim content to fit.
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
</Box>
);
}

export default App;
