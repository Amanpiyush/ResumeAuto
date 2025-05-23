import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Paper, styled, Button, Stack } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { Link } from '@mui/material';
import { Chip } from '@mui/material';

const ResumeSection = styled(Box)(({ theme }: { theme: Theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }: { theme: Theme }) => ({
  borderBottom: '1px solid black',
  marginBottom: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
  fontWeight: 'bold',
}));

export interface ResumeData {
  personalInfo: {
    name: string;
    linkedin: string;
    location: string;
    email: string;
    mobile: string;
  };
  summary: string;
  education: Array<{
    school: string;
    degree: string;
    location: string;
    date: string;
    gpa?: string;
  }>;
  skills: {
    [key: string]: string[];
  };
  projects: Array<{
    title: string;
    description: string;
    tech: string;
    date?: string;
    inProgress?: boolean;
  }>;
  certifications: Array<{
    name: string;
    details: string;
    date?: string;
    company?: string;
  }>;
  publications: Array<{
    title: string;
    details: string;
    technologies: string;
    date?: string;
  }>;
  extraSections?: Array<{
    title: string;
    items: Array<{
      title: string;
      description: string;
      date?: string;
    }>;
  }>;
}

export interface ResumeProps {
  data: ResumeData;
  fontFamily?: string;
  template?: 'amazon' | 'meta' | 'apple' | 'google' | 'microsoft' | 'custom' | 'two-column';
  pageCount?: 1 | 2 | 3 | 4 | 5;
  onPageOverflow?: (isOverflowing: boolean) => void;
}

const templates = {
  amazon: {
    header: {
      backgroundColor: '#232f3e',
      color: '#ffffff',
      padding: '20px',
      borderBottom: '4px solid #ff9900',
    },
    sectionTitle: {
      color: '#232f3e',
      borderBottom: '2px solid #ff9900',
      paddingBottom: '4px',
      marginBottom: '16px',
      fontWeight: 'bold',
    },
    bulletPoint: {
      color: '#232f3e',
      marginLeft: '16px',
      position: 'relative',
      '&::before': {
        content: '"•"',
        color: '#ff9900',
        position: 'absolute',
        left: '-16px',
      },
    },
    content: {
      backgroundColor: '#ffffff',
      padding: '40px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
  },
  meta: {
    header: {
      backgroundColor: '#1877f2',
      color: '#ffffff',
      padding: '20px',
      borderBottom: '4px solid #42b72a',
    },
    sectionTitle: {
      color: '#1877f2',
      borderBottom: '2px solid #42b72a',
      paddingBottom: '4px',
      marginBottom: '16px',
      fontWeight: 'bold',
    },
    bulletPoint: {
      color: '#1c1e21',
      marginLeft: '16px',
      position: 'relative',
      '&::before': {
        content: '"•"',
        color: '#1877f2',
        position: 'absolute',
        left: '-16px',
      },
    },
    content: {
      backgroundColor: '#ffffff',
      padding: '40px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
  },
  apple: {
    header: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '20px',
      borderBottom: '4px solid #86868b',
    },
    sectionTitle: {
      color: '#000000',
      borderBottom: '2px solid #86868b',
      paddingBottom: '4px',
      marginBottom: '16px',
      fontWeight: 'bold',
    },
    bulletPoint: {
      color: '#1d1d1f',
      marginLeft: '16px',
      position: 'relative',
      '&::before': {
        content: '"•"',
        color: '#000000',
        position: 'absolute',
        left: '-16px',
      },
    },
    content: {
      backgroundColor: '#ffffff',
      padding: '40px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
  },
  google: {
    header: {
      backgroundColor: '#4285f4',
      color: '#ffffff',
      padding: '20px',
      borderBottom: '4px solid #ea4335',
    },
    sectionTitle: {
      color: '#4285f4',
      borderBottom: '2px solid #ea4335',
      paddingBottom: '4px',
      marginBottom: '16px',
      fontWeight: 'bold',
    },
    bulletPoint: {
      color: '#202124',
      marginLeft: '16px',
      position: 'relative',
      '&::before': {
        content: '"•"',
        color: '#4285f4',
        position: 'absolute',
        left: '-16px',
      },
    },
    content: {
      backgroundColor: '#ffffff',
      padding: '40px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
  },
  microsoft: {
    header: {
      backgroundColor: '#00a4ef',
      color: '#ffffff',
      padding: '20px',
      borderBottom: '4px solid #7fba00',
    },
    sectionTitle: {
      color: '#00a4ef',
      borderBottom: '2px solid #7fba00',
      paddingBottom: '4px',
      marginBottom: '16px',
      fontWeight: 'bold',
    },
    bulletPoint: {
      color: '#323130',
      marginLeft: '16px',
      position: 'relative',
      '&::before': {
        content: '"•"',
        color: '#00a4ef',
        position: 'absolute',
        left: '-16px',
      },
    },
    content: {
      backgroundColor: '#ffffff',
      padding: '40px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
  },
  custom: {
    header: {
      backgroundColor: '#2C3E50',
      color: '#FFFFFF',
      padding: '20px',
      textAlign: 'center' as const,
    },
    sectionTitle: {
      color: '#2C3E50',
      borderBottom: '2px solid #2C3E50',
      paddingBottom: '5px',
      marginBottom: '10px',
    },
    bulletPoint: {
      color: '#2C3E50',
      marginLeft: '16px',
      position: 'relative',
      '&::before': {
        content: '"•"',
        color: '#2C3E50',
        position: 'absolute',
        left: '-16px',
      },
    },
    content: {
      backgroundColor: '#ffffff',
      padding: '40px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
  },
  'two-column': {
    header: {
      backgroundColor: '#ffffff',
      color: '#333333',
      padding: '20px',
      textAlign: 'center' as const,
      borderBottom: '2px solid #333333',
    },
    sectionTitle: {
      color: '#333333',
      borderBottom: '1px solid #333333',
      paddingBottom: '5px',
      marginBottom: '10px',
      fontWeight: 'bold',
      textTransform: 'uppercase' as const,
    },
    bulletPoint: {
      color: '#333333',
      marginLeft: '16px',
      position: 'relative',
      '&::before': {
        content: '"•"',
        color: '#333333',
        position: 'absolute',
        left: '-16px',
      },
    },
    content: {
      backgroundColor: '#ffffff',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
  },
};

export const Resume: React.FC<ResumeProps> = ({ 
  data, 
  fontFamily = 'Times New Roman', 
  template = 'custom', 
  pageCount = 1,
  onPageOverflow
}) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  // Adjust font size based on page count
  const [fontSize, setFontSize] = useState<number>(pageCount === 1 ? 10 : pageCount === 2 ? 10.5 : 11);
  const [lineHeight, setLineHeight] = useState<number>(pageCount === 1 ? 1.3 : 1.5); // Tighter line height for 1 page
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [marginScale, setMarginScale] = useState<number>(pageCount === 1 ? 0.7 : 1); // Reduce margins for 1 page
  
  // Reset font size when page count changes - this is the primary adjustment
  useEffect(() => {
    // Dynamic font size adjustment based on page count and content length
    const contentLength = 
      (data.summary?.length || 0) + 
      (data.education?.length || 0) * 100 + 
      Object.values(data.skills).reduce((acc, skills) => acc + skills.length * 20, 0) + 
      (data.projects?.length || 0) * 200 + 
      (data.certifications?.length || 0) * 100 + 
      (data.publications?.length || 0) * 150;
    
    // Base size adjustments by page count
    let baseFontSize: number;
    let baseLineHeight: number;
    let baseMarginScale: number;
    
    if (pageCount === 1) {
      baseFontSize = 10;
      baseLineHeight = 1.3;
      baseMarginScale = 0.7;
    } else if (pageCount === 2) {
      baseFontSize = 10.5;
      baseLineHeight = 1.4;
      baseMarginScale = 0.85;
    } else if (pageCount === 3) {
      baseFontSize = 11;
      baseLineHeight = 1.5;
      baseMarginScale = 1;
    } else {
      baseFontSize = 11.5;
      baseLineHeight = 1.5;
      baseMarginScale = 1.2;
    }
    
    // Content density adjustment
    // If there's a lot of content, make the font slightly smaller to fit more
    const contentDensityFactor = contentLength > 5000 ? 0.9 : 
                                contentLength > 3000 ? 0.95 : 
                                contentLength > 1500 ? 0.97 : 1;
    
    setFontSize(baseFontSize * contentDensityFactor);
    setLineHeight(baseLineHeight * (contentDensityFactor < 1 ? 0.95 : 1));
    setMarginScale(baseMarginScale * (contentDensityFactor < 1 ? 0.9 : 1));
  }, [pageCount, data]);
  
  // Overflow detection with improved responsiveness
  useEffect(() => {
    const checkOverflow = () => {
      if (!resumeRef.current) return false;
      
      const contentHeight = resumeRef.current.scrollHeight;
      
      // Calculate max height based on page count
      const pageHeight = 1056; // Approx A4 height in px at 96 DPI
      const maxHeight = pageHeight * pageCount;
      
      const isOverflowing = contentHeight > maxHeight;
      setIsOverflowing(isOverflowing);
      
      // Notify parent component about overflow status
      onPageOverflow && onPageOverflow(isOverflowing);
      
      return isOverflowing;
    };
    
    // Check for overflow when content or page count changes
    checkOverflow();
    
    // Add resize event listener for responsive checking
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
    
  }, [pageCount, fontSize, data, onPageOverflow]);
  
  // Spacing adjustments based on page count
  const sectionSpacing = {
    mb: pageCount === 1 ? 1.5 : 2.5, // Reduced spacing for single page
  };
  
  const itemSpacing = {
    mb: pageCount === 1 ? 0.8 : 1.5, // Reduced spacing for single page
  };
  
  // Render the resume content with appropriate spacing and page breaks
  const renderResumeContent = () => {
    if (pageCount === 1) {
      // Single page resume with minimal spacing
      return template === 'two-column' ? renderTwoColumnLayout() : renderStandardLayout();
    } else {
      // Improved multi-page distribution based on content length
      // Define sections and their approximate size/importance
      const sectionsToRender = [];
      
      // Always add header to first page
      sectionsToRender.push({ 
        id: 'header', 
        component: renderHeader, 
        priority: 1,
        weight: 5 // Header is small but important
      });
      
      // Add summary if it exists
      if (data.summary?.trim()) {
        sectionsToRender.push({ 
          id: 'summary', 
          component: renderSummary, 
          priority: 2,
          weight: data.summary.length / 100 // Weight based on length
        });
      }
      
      // Add education if it exists
      if (data.education?.length > 0) {
        sectionsToRender.push({ 
          id: 'education', 
          component: renderEducation, 
          priority: 3,
          weight: data.education.length * 10 // Weight based on number of entries
        });
      }
      
      // Add skills if they exist
      if (Object.values(data.skills).some(skills => skills.length > 0)) {
        sectionsToRender.push({ 
          id: 'skills', 
          component: renderSkills, 
          priority: 4,
          weight: Object.values(data.skills).reduce((acc, skills) => acc + skills.length, 0) * 2
        });
      }
      
      // Add projects if they exist
      if (data.projects?.length > 0) {
        sectionsToRender.push({ 
          id: 'projects', 
          component: renderProjects, 
          priority: 5,
          weight: data.projects.reduce((acc, project) => 
            acc + (project.description?.length || 0) / 50, 0) + data.projects.length * 10
        });
      }
      
      // Add certifications if they exist
      if (data.certifications?.length > 0) {
        sectionsToRender.push({ 
          id: 'certifications', 
          component: renderCertifications, 
          priority: 6,
          weight: data.certifications.length * 8
        });
      }
      
      // Add publications if they exist
      if (data.publications?.length > 0) {
        sectionsToRender.push({ 
          id: 'publications', 
          component: renderPublications, 
          priority: 7,
          weight: data.publications.length * 10
        });
      }
      
      // Add extra sections if they exist
      if (data.extraSections && data.extraSections.length > 0) {
        sectionsToRender.push({ 
          id: 'extraSections', 
          component: renderExtraSections, 
          priority: 8,
          weight: data.extraSections.reduce((acc, section) => 
            acc + section.items.length * 5, 0)
        });
      }
      
      // Calculate total weight
      const totalWeight = sectionsToRender.reduce((acc, section) => acc + section.weight, 0);
      
      // Distribute sections across pages more intelligently
      const pagesContent: Array<typeof sectionsToRender> = Array(pageCount).fill(null).map(() => []);
      let currentPage = 0;
      let currentPageWeight = 0;
      const weightPerPage = totalWeight / pageCount;
      
      // Sort by priority to maintain logical order
      sectionsToRender.sort((a, b) => a.priority - b.priority);
      
      // Distribute based on weight
      sectionsToRender.forEach(section => {
        // If adding this section would overflow the page weight by too much, move to next page
        if (currentPageWeight + section.weight > weightPerPage * 1.3 && currentPage < pageCount - 1) {
          currentPage++;
          currentPageWeight = 0;
        }
        
        pagesContent[currentPage].push(section);
        currentPageWeight += section.weight;
      });
      
  return (
        <Box>
          {pagesContent.map((pageSections, pageIndex) => (
            <React.Fragment key={`page-${pageIndex + 1}`}>
              {/* Page content */}
              <Box 
      sx={{ 
                  minHeight: pageIndex === pagesContent.length - 1 ? 'auto' : '10.5in',
                  maxHeight: pageIndex === pagesContent.length - 1 ? 'auto' : '10.5in',
                  position: 'relative',
                  overflow: 'hidden',
                  pb: 4,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Include header on all pages after the first one */}
                {pageIndex > 0 && (
                  <Box 
                    mb={2} 
                    sx={{ 
                      borderBottom: `2px solid ${
                        template === 'google' ? '#4285F4' : 
                        template === 'meta' ? '#1877F2' : 
                        template === 'amazon' ? '#FF9900' : 
                        template === 'apple' ? '#A2AAAD' : 
                        template === 'microsoft' ? '#7FBA00' : '#2C3E50'
                      }`,
                      pb: 1
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      fontWeight="bold" 
                      sx={{ fontFamily: fontFamily }}
                    >
                      {data.personalInfo.name} - Page {pageIndex + 1}
                    </Typography>
                  </Box>
                )}
                
                {/* Render sections for this page */}
                {pageSections.length > 0 ? (
                  pageSections.map(section => section.component())
                ) : (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', textAlign: 'center', my: 4 }}>
                    No content for this page
                  </Typography>
                )}
                
                {/* Spacer to push content to top */}
                <Box sx={{ flex: 1 }} />
                
                {/* Page indicator */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0,
                    fontSize: '8pt',
                    color: '#777',
                    mb: 1,
                    mr: 1
                  }}
                >
                  Page {pageIndex + 1} of {pageCount}
                </Box>
              </Box>
              
              {/* Add page break indicator between pages */}
              {pageIndex < pagesContent.length - 1 && (
                <Box 
                  sx={{ 
                    borderTop: '1px dashed #ccc',
                    my: 2,
                    position: 'relative'
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: '-10px', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      bgcolor: 'white',
                      px: 2,
                      fontSize: '9pt',
                      color: '#777'
                    }}
                  >
                    Continue on next page
                  </Box>
                </Box>
              )}
            </React.Fragment>
          ))}
        </Box>
      );
    }
  };
  
  // Render the two-column layout
  const renderTwoColumnLayout = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header Section */}
        <Box mb={2} sx={{ 
          borderBottom: '2px solid #333333',
          padding: pageCount === 1 ? '12px' : '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
              fontWeight: 800,
              letterSpacing: '0.5px',
            fontFamily: fontFamily,
            textAlign: 'center',
              mb: marginScale,
              textTransform: 'uppercase'
          }}
        >
          {data.personalInfo.name}
        </Typography>
          
          <Typography variant="body2" sx={{ 
            fontFamily: fontFamily, 
            mt: marginScale * 0.5,
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
            {data.personalInfo.email && (
              <span>{data.personalInfo.location ? ' | ' : ''} <Link href={`mailto:${data.personalInfo.email}`} sx={{ color: 'inherit', textDecoration: 'underline' }}>{data.personalInfo.email}</Link></span>
            )}
            {data.personalInfo.mobile && <span>{(data.personalInfo.location || data.personalInfo.email) ? ' | ' : ''} {data.personalInfo.mobile}</span>}
            {data.personalInfo.linkedin && (
              <span>{(data.personalInfo.location || data.personalInfo.email || data.personalInfo.mobile) ? ' | ' : ''} <Link href={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', textDecoration: 'underline' }}>{data.personalInfo.linkedin}</Link></span>
            )}
          </Typography>
        </Box>
        
        {/* Two Column Layout */}
        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 3 }}>
          {/* Left Column - Skills, Education, Certifications */}
          <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Skills Section */}
            {Object.values(data.skills).some(skillArray => skillArray.length > 0) && (
              <Box mb={1.5}>
                <Typography variant="h6" sx={{ 
                  fontFamily: fontFamily,
                  color: '#333333',
                  borderBottom: '1px solid #333333',
                  paddingBottom: '5px',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  SKILLS
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1,
                  mt: 1
                }}>
                  {Object.entries(data.skills)
                    .filter(([_, items]) => items.length > 0)
                    .map(([category, items]) => (
                      <Box key={category} mb={1}>
                        <Typography variant="body2" sx={{ 
                          fontFamily: fontFamily, 
                          fontWeight: 'bold',
                          mb: 0.5
                        }}>
                          {category}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: fontFamily }}>
                          {items.join(', ')}
        </Typography>
                      </Box>
                    ))}
                </Box>
              </Box>
            )}
            
            {/* Education Section */}
            {data.education.length > 0 && (
              <Box mb={1.5}>
                <Typography variant="h6" sx={{ 
                  fontFamily: fontFamily,
                  color: '#333333',
                  borderBottom: '1px solid #333333',
                  paddingBottom: '5px',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  EDUCATION
                </Typography>
                {data.education.map((edu, index) => (
                  <Box 
                    key={index} 
                    mb={index === data.education.length - 1 ? 0 : 1.5} 
                    mt={1}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ fontFamily: fontFamily }}>
                        {edu.school}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontStyle="italic" sx={{ fontFamily: fontFamily }}>
                      {edu.degree} {edu.gpa && `GPA: ${edu.gpa}`}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="body2" sx={{ fontFamily: fontFamily }}>
                        {edu.location}
          </Typography>
                      <Typography variant="body2" sx={{ fontFamily: fontFamily, textAlign: 'right', minWidth: '80px' }}>
                        {edu.date}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            
            {/* Certifications Section */}
            {data.certifications.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ 
                  fontFamily: fontFamily,
                  color: '#333333',
                  borderBottom: '1px solid #333333',
                  paddingBottom: '5px',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  CERTIFICATIONS
                </Typography>
                {data.certifications.map((cert, index) => (
                  <Box 
                    key={index} 
                    mb={index === data.certifications.length - 1 ? 0 : 1.5} 
                    mt={1}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <Typography variant="body2" sx={{ fontFamily: fontFamily, pr: 1, flex: '1 1 auto', fontWeight: 'bold' }}>
                        {cert.name}
                      </Typography>
                      {cert.date && (
                        <Typography variant="body2" sx={{ fontFamily: fontFamily, textAlign: 'right', minWidth: '80px', flex: '0 0 auto' }}>
                          {cert.date}
        </Typography>
                      )}
                    </Box>
          <Typography variant="body2" sx={{ fontFamily: fontFamily }}>
                      {cert.details}
                      {cert.company && <> | {cert.company}</>}
          </Typography>
        </Box>
                ))}
              </Box>
            )}
      </Box>

          {/* Right Column - Professional Summary, Experience, Projects, Publications */}
          <Box sx={{ width: '70%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Summary Section */}
            {data.summary && (
              <Box mb={1.5}>
                <Typography variant="h6" sx={{ 
                  fontFamily: fontFamily,
                  color: '#333333',
                  borderBottom: '1px solid #333333',
                  paddingBottom: '5px',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  PROFESSIONAL SUMMARY
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: fontFamily, mt: 1 }}>
                  {data.summary}
                </Typography>
              </Box>
            )}
            
            {/* Projects Section */}
            {data.projects.length > 0 && (
              <Box mb={1.5}>
                <Typography variant="h6" sx={{ 
                  fontFamily: fontFamily,
                  color: '#333333',
                  borderBottom: '1px solid #333333',
                  paddingBottom: '5px',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  EXPERIENCE
                </Typography>
                {data.projects.map((project, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      mb: index === data.projects.length - 1 ? 0 : 2, 
                      mt: 1
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 0.5
                    }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ fontFamily: fontFamily }}>
                        {project.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '80px', justifyContent: 'flex-end' }}>
                        {project.date && (
                          <Typography variant="body2" sx={{ fontFamily: fontFamily, textAlign: 'right' }}>
                            {project.date}
                          </Typography>
                        )}
                        {project.inProgress && (
                          <Chip 
                            label="In Progress" 
                            size="small" 
                            sx={{ 
                              bgcolor: 'white',
                              color: '#333333',
                              fontSize: '0.65rem',
                              height: '20px',
                              border: '2px solid #333333',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              px: 0.5
                            }} 
                          />
                        )}
                      </Box>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: fontFamily, 
                        mb: 0.5
                      }}
                    >
                      {project.description}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: fontFamily, fontStyle: 'italic' }}>
                      <strong>Tech:</strong> {project.tech}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            
            {/* Publications Section */}
            {data.publications.length > 0 && (
              <Box mb={1.5}>
                <Typography variant="h6" sx={{ 
                  fontFamily: fontFamily,
                  color: '#333333',
                  borderBottom: '1px solid #333333',
                  paddingBottom: '5px',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  PUBLICATIONS
                </Typography>
                {data.publications.map((pub, index) => (
                  <Box 
                    key={index} 
                    mb={index === data.publications.length - 1 ? 0 : 1.5} 
                    mt={1}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontFamily: fontFamily, fontWeight: 'bold', pr: 1, flex: '1 1 auto' }}>
                        {pub.title}
                      </Typography>
                      {pub.date && (
                        <Typography variant="body2" sx={{ fontFamily: fontFamily, textAlign: 'right', minWidth: '80px', flex: '0 0 auto' }}>
                          {pub.date}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ fontFamily: fontFamily, mb: 0.5 }}>
                      {pub.details}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: fontFamily, fontStyle: 'italic' }}>
                      <strong>Technologies:</strong> {pub.technologies}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            
            {/* Extra Sections */}
            {data.extraSections?.filter(section => section.items.length > 0).map((section, sectionIndex) => (
              <Box 
                key={sectionIndex} 
                mb={sectionIndex === (data.extraSections?.length || 0) - 1 ? 0 : 1.5}
              >
                <Typography variant="h6" sx={{ 
                  fontFamily: fontFamily,
                  color: '#333333',
                  borderBottom: '1px solid #333333',
                  paddingBottom: '5px',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {section.title}
                </Typography>
                {section.items.map((item, itemIndex) => (
                  <Box 
                    key={itemIndex} 
                    mb={itemIndex === section.items.length - 1 ? 0 : 1.5} 
                    mt={1}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <Typography variant="body2" sx={{ fontFamily: fontFamily, pr: 1, flex: '1 1 auto', fontWeight: 'bold' }}>
                        {item.title}
                      </Typography>
                      {item.date && (
                        <Typography variant="body2" sx={{ fontFamily: fontFamily, textAlign: 'right', minWidth: '80px', flex: '0 0 auto' }}>
                          {item.date}
          </Typography>
                      )}
                    </Box>
          <Typography variant="body2" sx={{ fontFamily: fontFamily }}>
                      {item.description}
          </Typography>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };
  
  // Render the standard layout
  const renderStandardLayout = () => {
    return (
      <Box>
        {renderHeader()}
        {renderSummary()}
        {renderEducation()}
        {renderSkills()}
        {renderProjects()}
        {renderCertifications()}
        {renderPublications()}
        {renderExtraSections()}
      </Box>
    );
  };
  
  // Render methods for each section
  const renderHeader = () => (
    <Box mb={pageCount === 1 ? 1.5 : sectionSpacing.mb * 1.2} sx={{ 
      ...templates[template].header,
      padding: pageCount === 1 ? '12px' : '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 800,
          letterSpacing: '0.5px',
          fontFamily: fontFamily,
          textAlign: 'center',
          mb: marginScale
        }}
      >
        {data.personalInfo.name}
      </Typography>
      <Typography variant="body2" sx={{ fontFamily: fontFamily }}>
        {data.personalInfo.location}
      </Typography>
      <Typography variant="body2" sx={{ 
        fontFamily: fontFamily, 
        mt: marginScale * 0.5,
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {data.personalInfo.linkedin && (
          <span>LinkedIn: <Link href={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', textDecoration: 'underline' }}>{data.personalInfo.linkedin}</Link></span>
        )}
        {data.personalInfo.email && (
          <span>{data.personalInfo.linkedin ? ' | ' : ''} Email: <Link href={`mailto:${data.personalInfo.email}`} sx={{ color: 'inherit', textDecoration: 'underline' }}>{data.personalInfo.email}</Link></span>
        )}
        {data.personalInfo.mobile && <span>{(data.personalInfo.linkedin || data.personalInfo.email) ? ' | ' : ''} Mobile: {data.personalInfo.mobile}</span>}
      </Typography>
    </Box>
  );
  
  const renderSummary = () => (
    data.summary && (
      <Box mb={pageCount === 1 ? 1.2 : sectionSpacing.mb * 1.1}>
        <Typography variant="h6" sx={{ ...templates[template].sectionTitle, fontFamily: fontFamily }}>
          SUMMARY
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: fontFamily, mt: marginScale * 0.5 }}>
          {data.summary}
        </Typography>
      </Box>
    )
  );

  const renderEducation = () => (
    data.education.length > 0 && (
      <Box mb={pageCount === 1 ? 1.2 : sectionSpacing.mb}>
        <Typography variant="h6" sx={{ ...templates[template].sectionTitle, fontFamily: fontFamily }}>
          EDUCATION
        </Typography>
        {data.education.map((edu, index) => (
          <Box 
            key={index} 
            mb={index === data.education.length - 1 ? 0 : pageCount === 1 ? 0.5 : itemSpacing.mb} 
            mt={pageCount === 1 ? 0.3 : marginScale * 0.5}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: fontFamily }}>
                {edu.school}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: fontFamily, textAlign: 'right', minWidth: '80px' }}>
                {edu.location}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="body2" fontStyle="italic" sx={{ fontFamily: fontFamily }}>
              {edu.degree} {edu.gpa && `GPA: ${edu.gpa}`}
            </Typography>
              <Typography variant="body2" sx={{ fontFamily: fontFamily, textAlign: 'right', minWidth: '80px' }}>
              {edu.date}
            </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    )
  );

  const renderSkills = () => (
    Object.values(data.skills).some(skillArray => skillArray.length > 0) && (
      <Box mb={pageCount === 1 ? 1.2 : sectionSpacing.mb}>
        <Typography variant="h6" sx={{ ...templates[template].sectionTitle, fontFamily: fontFamily }}>
          SKILLS SUMMARY
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: pageCount === 1 ? 0.3 : marginScale * 0.5, 
          mt: pageCount === 1 ? 0.3 : marginScale * 0.5 
        }}>
          {Object.entries(data.skills)
            .filter(([_, items]) => items.length > 0)
            .map(([category, items]) => (
            <Typography variant="body2" key={category} sx={{ fontFamily: fontFamily }}>
              <strong>{category}:</strong>{' '}
              {items.join(', ')}
            </Typography>
          ))}
        </Box>
      </Box>
    )
  );

  const renderProjects = () => (
    data.projects.length > 0 && (
      <Box mb={pageCount === 1 ? 1.2 : sectionSpacing.mb}>
        <Typography variant="h6" sx={{ ...templates[template].sectionTitle, fontFamily: fontFamily }}>
          PROJECTS
        </Typography>
        {data.projects.map((project, index) => (
          <Box 
            key={index} 
            sx={{ 
              mb: index === data.projects.length - 1 ? 0 : pageCount === 1 ? 0.8 : itemSpacing.mb * 1.2, 
              mt: pageCount === 1 ? 0.3 : marginScale * 0.5 
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: pageCount === 1 ? 0.2 : marginScale * 0.3 
            }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: fontFamily }}>
                {project.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '80px', justifyContent: 'flex-end' }}>
                {project.date && (
                  <Typography variant="body2" sx={{ fontFamily: fontFamily, textAlign: 'right' }}>
                    {project.date}
                  </Typography>
                )}
                {project.inProgress && (
                  <Chip 
                    label="In Progress" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'white',
                      color: template === 'google' ? '#4285F4' : 
                            template === 'meta' ? '#1877F2' : 
                            template === 'amazon' ? '#FF9900' : 
                            template === 'apple' ? '#A2AAAD' : 
                            template === 'microsoft' ? '#7FBA00' : '#1976d2',
                      fontSize: '0.65rem',
                      height: '20px',
                      border: `2px solid ${
                        template === 'google' ? '#4285F4' : 
                        template === 'meta' ? '#1877F2' : 
                        template === 'amazon' ? '#FF9900' : 
                        template === 'apple' ? '#A2AAAD' : 
                        template === 'microsoft' ? '#7FBA00' : '#1976d2'
                      }`,
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      px: 0.5
                    }} 
                  />
                )}
              </Box>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: fontFamily, 
                mb: pageCount === 1 ? 0.2 : marginScale * 0.3
              }}
            >
              <strong>Description:</strong> {project.description}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: fontFamily }}>
              <strong>Tech:</strong> {project.tech}
            </Typography>
          </Box>
        ))}
      </Box>
    )
  );

  const renderCertifications = () => (
    data.certifications.length > 0 && (
      <Box mb={pageCount === 1 ? 1.2 : sectionSpacing.mb}>
        <Typography variant="h6" sx={{ ...templates[template].sectionTitle, fontFamily: fontFamily }}>
          CERTIFICATIONS
        </Typography>
        {data.certifications.map((cert, index) => (
          <Box 
            key={index} 
            mb={index === data.certifications.length - 1 ? 0 : pageCount === 1 ? 0.5 : itemSpacing.mb} 
            mt={pageCount === 1 ? 0.3 : marginScale * 0.5}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              <Typography variant="body2" sx={{ fontFamily: fontFamily, pr: 1, flex: '1 1 auto' }}>
              <strong>{cert.name}:</strong> {cert.details}
                {cert.company && <> | <strong>Provider:</strong> {cert.company}</>}
            </Typography>
              {cert.date && (
                <Typography variant="body2" sx={{ fontFamily: fontFamily, textAlign: 'right', minWidth: '80px', flex: '0 0 auto' }}>
                  {cert.date}
            </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    )
  );

  const renderPublications = () => (
    data.publications.length > 0 && (
      <Box mb={pageCount === 1 ? 1.2 : sectionSpacing.mb}>
        <Typography variant="h6" sx={{ ...templates[template].sectionTitle, fontFamily: fontFamily }}>
          PUBLICATIONS
        </Typography>
        {data.publications.map((pub, index) => (
          <Box 
            key={index} 
            mb={index === data.publications.length - 1 ? 0 : pageCount === 1 ? 0.5 : itemSpacing.mb} 
            mt={pageCount === 1 ? 0.3 : marginScale * 0.5}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', mb: pageCount === 1 ? 0.2 : marginScale * 0.3 }}>
              <Typography variant="body2" sx={{ fontFamily: fontFamily, fontWeight: 'bold', pr: 1, flex: '1 1 auto' }}>
                {pub.title}
              </Typography>
              {pub.date && (
                <Typography variant="body2" sx={{ fontFamily: fontFamily, textAlign: 'right', minWidth: '80px', flex: '0 0 auto' }}>
                  {pub.date}
                </Typography>
              )}
            </Box>
            <Typography variant="body2" sx={{ fontFamily: fontFamily, mb: pageCount === 1 ? 0.2 : marginScale * 0.3 }}>
              <strong>Details:</strong> {pub.details}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: fontFamily }}>
              <strong>Technologies Used:</strong> {pub.technologies}
            </Typography>
          </Box>
        ))}
      </Box>
    )
  );
  
  const renderExtraSections = () => (
    data.extraSections?.filter(section => section.items.length > 0).map((section, sectionIndex) => (
      <Box 
        key={sectionIndex} 
        mb={sectionIndex === (data.extraSections?.length || 0) - 1 ? 0 : pageCount === 1 ? 1 : sectionSpacing.mb}
      >
          <Typography variant="h6" sx={{ ...templates[template].sectionTitle, fontFamily: fontFamily }}>
            {section.title}
          </Typography>
          {section.items.map((item, itemIndex) => (
          <Box 
            key={itemIndex} 
            mb={itemIndex === section.items.length - 1 ? 0 : pageCount === 1 ? 0.5 : itemSpacing.mb} 
            mt={pageCount === 1 ? 0.3 : marginScale * 0.5}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              <Typography variant="body2" sx={{ fontFamily: fontFamily, pr: 1, flex: '1 1 auto' }}>
                <strong>{item.title}:</strong> {item.description}
              </Typography>
              {item.date && (
                <Typography variant="body2" sx={{ fontFamily: fontFamily, textAlign: 'right', minWidth: '80px', flex: '0 0 auto' }}>
                  {item.date}
                </Typography>
              )}
            </Box>
        </Box>
      ))}
        </Box>
    ))
  );
  
  // Page style based on page count
  const pageStyle = {
    height: pageCount === 1 ? '11in' : 'auto',
    minHeight: pageCount === 1 ? '11in' : 'auto',
    maxHeight: pageCount > 1 ? `${11 * pageCount}in` : '11in',
    overflow: 'hidden',
    position: 'relative' as const,
  };
  
  return (
    <Paper 
      ref={resumeRef}
      elevation={0} 
      sx={{ 
        p: pageCount === 1 ? 2 : 3, // Reduced padding for single page
        maxWidth: '8.5in', 
        margin: 'auto', 
        backgroundColor: 'white',
        fontFamily: fontFamily,
        fontSize: `${fontSize}pt`,
        lineHeight: lineHeight,
        '& .MuiTypography-root': {
          fontFamily: fontFamily,
          fontSize: `${fontSize}pt`,
          lineHeight: lineHeight,
        },
        '& .MuiTypography-h4': {
          fontSize: `${fontSize + (pageCount === 1 ? 6 : 8)}pt`,
          lineHeight: lineHeight,
        },
        '& .MuiTypography-h6': {
          fontSize: `${fontSize + (pageCount === 1 ? 1.5 : 2)}pt`,
          lineHeight: lineHeight,
          marginBottom: pageCount === 1 ? '0.5rem' : '0.75rem',
        },
        ...pageStyle,
      }}
    >
      {renderResumeContent()}
    </Paper>
  );
};

export default Resume; 