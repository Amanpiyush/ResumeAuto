import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Grid,
  Chip,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { ResumeData } from './Resume';

interface ResumeFormProps {
  data: ResumeData;
  onUpdate: (data: ResumeData) => void;
  selectedJobRole?: string;
  skillSuggestions?: Record<string, string[]>;
  onOpenSkillSuggestions?: (category: string) => void;
}

const textFieldStyle = {
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  '& .MuiInputLabel-root': {
    color: '#1976d2',
    '&.Mui-focused': {
      color: '#1976d2',
    },
  },
};

const accordionStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  '&:before': {
    display: 'none',
  },
  '& .MuiAccordionSummary-root': {
    backgroundColor: '#e3f2fd',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#bbdefb',
    },
  },
};

const ResumeForm: React.FC<ResumeFormProps> = ({ data, onUpdate, selectedJobRole, skillSuggestions, onOpenSkillSuggestions }) => {
  const [expanded, setExpanded] = useState<string | false>('personalInfo');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [skillRelevance, setSkillRelevance] = useState<{[skill: string]: number}>({});

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    onUpdate({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const updateSummary = (value: string) => {
    onUpdate({ ...data, summary: value });
  };

  const addEducation = () => {
    onUpdate({
      ...data,
      education: [
        ...data.education,
        { school: '', degree: '', location: '', date: '', gpa: '' },
      ],
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...data.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onUpdate({ ...data, education: newEducation });
  };

  const removeEducation = (index: number) => {
    onUpdate({
      ...data,
      education: data.education.filter((_, i) => i !== index),
    });
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === data.education.length - 1)) {
      return; // Can't move further in this direction
    }
    
    const newEducation = [...data.education];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    const temp = newEducation[index];
    newEducation[index] = newEducation[targetIndex];
    newEducation[targetIndex] = temp;
    
    console.log(`Moved education item ${index} ${direction} to position ${targetIndex}`);
    
    onUpdate({ ...data, education: newEducation });
  };

  const addSkill = (category: keyof typeof data.skills, value: string) => {
    if (value.trim()) {
      onUpdate({
        ...data,
        skills: {
          ...data.skills,
          [category]: [...data.skills[category], value.trim()],
        },
      });
    }
  };

  const removeSkill = (category: keyof typeof data.skills, index: number) => {
    onUpdate({
      ...data,
      skills: {
        ...data.skills,
        [category]: data.skills[category].filter((_, i) => i !== index),
      },
    });
  };

  const moveSkill = (category: keyof typeof data.skills, index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === data.skills[category].length - 1)) {
      return;
    }
    
    const newSkills = [...data.skills[category]];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    const temp = newSkills[index];
    newSkills[index] = newSkills[targetIndex];
    newSkills[targetIndex] = temp;
    
    onUpdate({
      ...data,
      skills: {
        ...data.skills,
        [category]: newSkills,
      },
    });
  };

  const addProject = () => {
    onUpdate({
      ...data,
      projects: [...data.projects, { title: '', description: '', tech: '', date: '', inProgress: false }],
    });
  };

  const updateProject = (index: number, field: string, value: string) => {
    const newProjects = [...data.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onUpdate({ ...data, projects: newProjects });
  };

  const removeProject = (index: number) => {
    onUpdate({
      ...data,
      projects: data.projects.filter((_, i) => i !== index),
    });
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === data.projects.length - 1)) {
      return;
    }
    
    const newProjects = [...data.projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;
    
    onUpdate({ ...data, projects: newProjects });
  };

  const addCertification = () => {
    onUpdate({
      ...data,
      certifications: [...data.certifications, { name: '', details: '', date: '', company: '' }],
    });
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const newCertifications = [...data.certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    onUpdate({ ...data, certifications: newCertifications });
  };

  const removeCertification = (index: number) => {
    onUpdate({
      ...data,
      certifications: data.certifications.filter((_, i) => i !== index),
    });
  };

  const moveCertification = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === data.certifications.length - 1)) {
      return;
    }
    
    const newCertifications = [...data.certifications];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    const temp = newCertifications[index];
    newCertifications[index] = newCertifications[targetIndex];
    newCertifications[targetIndex] = temp;
    
    onUpdate({ ...data, certifications: newCertifications });
  };

  const addPublication = () => {
    onUpdate({
      ...data,
      publications: [...data.publications, { title: '', details: '', technologies: '' }],
    });
  };

  const updatePublication = (index: number, field: string, value: string) => {
    const newPublications = [...data.publications];
    newPublications[index] = { ...newPublications[index], [field]: value };
    onUpdate({ ...data, publications: newPublications });
  };

  const removePublication = (index: number) => {
    onUpdate({
      ...data,
      publications: data.publications.filter((_, i) => i !== index),
    });
  };

  const movePublication = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === data.publications.length - 1)) {
      return;
    }
    
    const newPublications = [...data.publications];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    const temp = newPublications[index];
    newPublications[index] = newPublications[targetIndex];
    newPublications[targetIndex] = temp;
    
    onUpdate({ ...data, publications: newPublications });
  };

  const addExtraSection = () => {
    onUpdate({
      ...data,
      extraSections: [
        ...(data.extraSections || []),
        {
          title: 'New Section',
          items: [{ title: '', description: '', date: '' }],
        },
      ],
    });
  };

  const updateExtraSection = (sectionIndex: number, field: string, value: string) => {
    const newExtraSections = [...(data.extraSections || [])];
    if (field === 'title') {
      newExtraSections[sectionIndex] = {
        ...newExtraSections[sectionIndex],
        title: value,
      };
    } else {
      const [itemIndex, itemField] = field.split('.');
      newExtraSections[sectionIndex].items[parseInt(itemIndex)] = {
        ...newExtraSections[sectionIndex].items[parseInt(itemIndex)],
        [itemField]: value,
      };
    }
    onUpdate({ ...data, extraSections: newExtraSections });
  };

  const addExtraSectionItem = (sectionIndex: number) => {
    const newExtraSections = [...(data.extraSections || [])];
    newExtraSections[sectionIndex].items.push({ title: '', description: '', date: '' });
    onUpdate({ ...data, extraSections: newExtraSections });
  };

  const removeExtraSectionItem = (sectionIndex: number, itemIndex: number) => {
    const newExtraSections = [...(data.extraSections || [])];
    newExtraSections[sectionIndex].items = newExtraSections[sectionIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    onUpdate({ ...data, extraSections: newExtraSections });
  };

  const removeExtraSection = (sectionIndex: number) => {
    onUpdate({
      ...data,
      extraSections: (data.extraSections || []).filter((_, i) => i !== sectionIndex),
    });
  };

  const moveExtraSection = (sectionIndex: number, direction: 'up' | 'down') => {
    if (!data.extraSections) return;
    
    if ((direction === 'up' && sectionIndex === 0) || 
        (direction === 'down' && sectionIndex === data.extraSections.length - 1)) {
      return;
    }
    
    const newExtraSections = [...data.extraSections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    
    // Swap positions
    const temp = newExtraSections[sectionIndex];
    newExtraSections[sectionIndex] = newExtraSections[targetIndex];
    newExtraSections[targetIndex] = temp;
    
    onUpdate({ ...data, extraSections: newExtraSections });
  };
  
  const moveExtraSectionItem = (sectionIndex: number, itemIndex: number, direction: 'up' | 'down') => {
    if (!data.extraSections) return;
    
    const items = data.extraSections[sectionIndex].items;
    
    if ((direction === 'up' && itemIndex === 0) || 
        (direction === 'down' && itemIndex === items.length - 1)) {
      return;
    }
    
    const newExtraSections = [...data.extraSections];
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    
    // Swap positions
    const temp = newExtraSections[sectionIndex].items[itemIndex];
    newExtraSections[sectionIndex].items[itemIndex] = newExtraSections[sectionIndex].items[targetIndex];
    newExtraSections[sectionIndex].items[targetIndex] = temp;
    
    onUpdate({ ...data, extraSections: newExtraSections });
  };

  const addSkillCategory = () => {
    if (newSkillCategory.trim()) {
      onUpdate({
        ...data,
        skills: {
          ...data.skills,
          [newSkillCategory.trim()]: [],
        },
      });
      setNewSkillCategory('');
    }
  };

  const removeSkillCategory = (category: string) => {
    const newSkills = { ...data.skills };
    delete newSkills[category];
    onUpdate({
      ...data,
      skills: newSkills,
    });
  };

  const getSkillRelevance = (skill: string, jobRole: string): number => {
    if (skillRelevance[skill] !== undefined) {
      return skillRelevance[skill];
    }
    
    let relevance = 1;
    
    if (jobRole && skillSuggestions && skillSuggestions[jobRole]) {
      const suggestions = skillSuggestions[jobRole];
      
      if (suggestions.slice(0, 5).includes(skill)) {
        relevance = 3;
      } 
      else if (suggestions.includes(skill)) {
        relevance = 2;
      }
    }
    
    setSkillRelevance(prev => ({...prev, [skill]: relevance}));
    
    return relevance;
  };
  
  const getRelevanceInfo = (relevance: number) => {
    switch(relevance) {
      case 3:
        return { label: 'High', color: '#4caf50' };
      case 2:
        return { label: 'Medium', color: '#ff9800' };
      default:
        return { label: 'Low', color: '#9e9e9e' };
    }
  };

  // Function to update a skill
  const updateSkill = (category: string, index: number, newValue: string) => {
    const updatedSkills = { ...data.skills };
    updatedSkills[category] = [...updatedSkills[category]];
    updatedSkills[category][index] = newValue;
    onUpdate({ ...data, skills: updatedSkills });
  };

  return (
    <Box>
      {/* Personal Information */}
      <Accordion expanded={expanded === 'personalInfo'} onChange={handleChange('personalInfo')} sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Personal Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={data.personalInfo.name}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
              sx={textFieldStyle}
            />
            <TextField
              fullWidth
              label="LinkedIn"
              value={data.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              sx={textFieldStyle}
            />
            <TextField
              fullWidth
              label="Location"
              value={data.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              sx={textFieldStyle}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                sx={textFieldStyle}
              />
              <TextField
                fullWidth
                label="Mobile"
                value={data.personalInfo.mobile}
                onChange={(e) => updatePersonalInfo('mobile', e.target.value)}
                sx={textFieldStyle}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Professional Summary */}
      <Accordion expanded={expanded === 'summary'} onChange={handleChange('summary')} sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Professional Summary</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Summary"
            value={data.summary}
            onChange={(e) => updateSummary(e.target.value)}
            sx={textFieldStyle}
          />
        </AccordionDetails>
      </Accordion>

      {/* Skills */}
      <Accordion expanded={expanded === 'skills'} onChange={handleChange('skills')} sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Skills</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Add New Skill Category */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                placeholder="New Skill Category"
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                sx={textFieldStyle}
              />
              <Button
                startIcon={<AddIcon />}
                onClick={addSkillCategory}
                sx={{
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#1565c0' },
                  color: 'white',
                  borderRadius: '20px',
                  boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                  transition: 'all 0.2s ease',
                  textTransform: 'none',
                  padding: '8px 16px',
                  fontWeight: 500
                }}
              >
                Add Category
              </Button>
            </Box>

            {/* Existing Skill Categories */}
            {Object.entries(data.skills).map(([category, items]) => (
              <Paper key={category} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ color: '#1976d2' }}>
                    {category}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onOpenSkillSuggestions && onOpenSkillSuggestions(category)}
                      sx={{
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontWeight: 500,
                        boxShadow: '0 2px 4px rgba(25, 118, 210, 0.15)',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          borderColor: '#1565c0',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 8px rgba(25, 118, 210, 0.2)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                      startIcon={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span role="img" aria-label="suggestions" style={{ fontSize: '1rem' }}>💡</span>
                        </Box>
                      }
                    >
                      Suggestions
                    </Button>
                    <IconButton
                      onClick={() => removeSkillCategory(category)}
                      sx={{ color: '#1976d2' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {items.map((item, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 0.75,
                      mr: 0.75
                    }}>
                      {selectedJobRole && (
                        <Chip
                          size="small"
                          label={getRelevanceInfo(getSkillRelevance(item, selectedJobRole)).label}
                          sx={{ 
                            mr: 0.75, 
                            bgcolor: 'white',
                            border: `1px solid ${getRelevanceInfo(getSkillRelevance(item, selectedJobRole)).color}`,
                            color: getRelevanceInfo(getSkillRelevance(item, selectedJobRole)).color,
                            minWidth: '40px',
                            borderRadius: '12px',
                            fontWeight: 'medium',
                            height: '20px',
                            '& .MuiChip-label': {
                              padding: '0 6px',
                              fontSize: '0.65rem'
                            }
                          }}
                        />
                      )}
                      <TextField
                        size="small"
                        value={item}
                        onChange={(e) => updateSkill(category, index, e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              size="small"
                              onClick={() => {
                                const updatedSkills = { ...data.skills };
                                updatedSkills[category] = updatedSkills[category].filter((_, idx) => idx !== index);
                                onUpdate({ ...data, skills: updatedSkills });
                              }}
                              sx={{ 
                                color: '#f44336',
                                '&:hover': {
                                  backgroundColor: 'rgba(244, 67, 54, 0.08)'
                                },
                                padding: '2px',
                                fontSize: '0.75rem'
                              }}
                            >
                              <span role="img" aria-label="delete" style={{ fontSize: '0.75rem' }}>❌</span>
                            </IconButton>
                          ),
                        }}
                        sx={{ 
                          maxWidth: '200px',
                          '.MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            border: '1.5px solid #4caf50',
                            overflow: 'hidden',
                            backgroundColor: 'rgba(76, 175, 80, 0.04)',
                            transition: 'all 0.2s ease',
                            height: '32px',
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.08)',
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                            },
                            '& fieldset': {
                              border: 'none'
                            },
                            '&.Mui-focused fieldset': {
                              border: 'none',
                              borderWidth: '0'
                            }
                          },
                          '& .MuiInputBase-input': {
                            fontWeight: 500,
                            color: '#2e7d32',
                            fontSize: '0.75rem',
                            padding: '6px 8px'
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add new skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(category as keyof typeof data.skills, newSkill);
                        setNewSkill('');
                      }
                    }}
                    sx={textFieldStyle}
                  />
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => {
                      addSkill(category as keyof typeof data.skills, newSkill);
                      setNewSkill('');
                    }}
                    disabled={!newSkill.trim()}
                    sx={{
                      backgroundColor: '#1976d2',
                      '&:hover': { backgroundColor: '#1565c0' },
                      color: 'white',
                      borderRadius: '20px',
                      boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                      transition: 'all 0.2s ease',
                      textTransform: 'none',
                      padding: '6px 16px',
                      fontWeight: 500,
                      '&:disabled': {
                        backgroundColor: 'rgba(25, 118, 210, 0.3)',
                        color: 'white'
                      }
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Education */}
      <Accordion expanded={expanded === 'education'} onChange={handleChange('education')} sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Education</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.education.map((edu, index) => (
              <Paper key={index} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">Education #{index + 1}</Typography>
                  <Box sx={{ display: 'flex' }}>
                    <IconButton
                      onClick={() => moveEducation(index, 'up')}
                      disabled={index === 0}
                      sx={{ color: '#2e7d32' }}
                    >
                      <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => moveEducation(index, 'down')}
                      disabled={index === data.education.length - 1}
                      sx={{ color: '#2e7d32' }}
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => removeEducation(index)}
                      sx={{ color: '#2e7d32' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="School"
                    value={edu.school}
                    onChange={(e) => updateEducation(index, 'school', e.target.value)}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    label="Location"
                    value={edu.location}
                    onChange={(e) => updateEducation(index, 'location', e.target.value)}
                    sx={textFieldStyle}
                  />
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Date"
                      value={edu.date}
                      onChange={(e) => updateEducation(index, 'date', e.target.value)}
                      sx={textFieldStyle}
                    />
                    <TextField
                      fullWidth
                      label="GPA"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                      sx={textFieldStyle}
                    />
                  </Box>
                </Box>
              </Paper>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addEducation}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
                color: 'white',
                borderRadius: '20px',
                boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                transition: 'all 0.2s ease',
                textTransform: 'none',
                padding: '8px 16px',
                fontWeight: 500
              }}
            >
              Add Education
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Projects */}
      <Accordion expanded={expanded === 'projects'} onChange={handleChange('projects')} sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Projects</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.projects.map((project, index) => (
              <Paper key={index} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">Project #{index + 1}</Typography>
                  <Box sx={{ display: 'flex' }}>
                    <IconButton
                      onClick={() => moveProject(index, 'up')}
                      disabled={index === 0}
                      sx={{ color: '#2e7d32' }}
                    >
                      <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => moveProject(index, 'down')}
                      disabled={index === data.projects.length - 1}
                      sx={{ color: '#2e7d32' }}
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => removeProject(index)}
                      sx={{ color: '#2e7d32' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={project.title}
                    onChange={(e) => updateProject(index, 'title', e.target.value)}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Description"
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    label="Technologies Used"
                    value={project.tech}
                    onChange={(e) => updateProject(index, 'tech', e.target.value)}
                    sx={textFieldStyle}
                  />
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      label="Date"
                      value={project.date}
                      onChange={(e) => updateProject(index, 'date', e.target.value)}
                      size="small"
                      disabled={project.inProgress}
                    />
                    <Button
                      variant={project.inProgress ? "contained" : "outlined"}
                      size="small"
                      onClick={() => {
                        const updatedProjects = [...data.projects];
                        updatedProjects[index].inProgress = !updatedProjects[index].inProgress;
                        if (updatedProjects[index].inProgress) {
                          updatedProjects[index].date = "Present";
                        } else {
                          updatedProjects[index].date = "";
                        }
                        onUpdate({ ...data, projects: updatedProjects });
                      }}
                      sx={{
                        minWidth: '120px',
                        bgcolor: project.inProgress ? '#1976d2' : 'transparent',
                        color: project.inProgress ? 'white' : '#1976d2',
                        border: project.inProgress ? 'none' : '2px solid #1976d2',
                        borderRadius: '4px',
                        fontWeight: project.inProgress ? 'bold' : 'medium',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: project.inProgress ? '#1565c0' : 'rgba(25, 118, 210, 0.08)',
                          border: project.inProgress ? 'none' : '2px solid #1565c0',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {project.inProgress ? "In Progress" : "Mark as Current"}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addProject}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
                color: 'white',
                borderRadius: '20px',
                boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                transition: 'all 0.2s ease',
                textTransform: 'none',
                padding: '8px 16px',
                fontWeight: 500
              }}
            >
              Add Project
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Certifications */}
      <Accordion expanded={expanded === 'certifications'} onChange={handleChange('certifications')} sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Certifications</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.certifications.map((cert, index) => (
              <Paper key={index} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">Certification #{index + 1}</Typography>
                  <Box sx={{ display: 'flex' }}>
                    <IconButton
                      onClick={() => moveCertification(index, 'up')}
                      disabled={index === 0}
                      sx={{ color: '#2e7d32' }}
                    >
                      <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => moveCertification(index, 'down')}
                      disabled={index === data.certifications.length - 1}
                      sx={{ color: '#2e7d32' }}
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => removeCertification(index)}
                      sx={{ color: '#2e7d32' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={cert.name}
                    onChange={(e) => updateCertification(index, 'name', e.target.value)}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Details"
                    value={cert.details}
                    onChange={(e) => updateCertification(index, 'details', e.target.value)}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    label="Provider/Company"
                    value={cert.company || ''}
                    onChange={(e) => updateCertification(index, 'company', e.target.value)}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    label="Date"
                    value={cert.date}
                    onChange={(e) => updateCertification(index, 'date', e.target.value)}
                    sx={textFieldStyle}
                  />
                </Box>
              </Paper>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addCertification}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
                color: 'white',
                borderRadius: '20px',
                boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                transition: 'all 0.2s ease',
                textTransform: 'none',
                padding: '8px 16px',
                fontWeight: 500
              }}
            >
              Add Certification
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Publications */}
      <Accordion expanded={expanded === 'publications'} onChange={handleChange('publications')} sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Publications</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.publications.map((pub, index) => (
              <Paper key={index} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">Publication #{index + 1}</Typography>
                  <Box sx={{ display: 'flex' }}>
                    <IconButton
                      onClick={() => movePublication(index, 'up')}
                      disabled={index === 0}
                      sx={{ color: '#2e7d32' }}
                    >
                      <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => movePublication(index, 'down')}
                      disabled={index === data.publications.length - 1}
                      sx={{ color: '#2e7d32' }}
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => removePublication(index)}
                      sx={{ color: '#2e7d32' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={pub.title}
                    onChange={(e) => updatePublication(index, 'title', e.target.value)}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Details"
                    value={pub.details}
                    onChange={(e) => updatePublication(index, 'details', e.target.value)}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    label="Technologies Used"
                    value={pub.technologies}
                    onChange={(e) => updatePublication(index, 'technologies', e.target.value)}
                    sx={textFieldStyle}
                  />
                </Box>
              </Paper>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addPublication}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
                color: 'white',
                borderRadius: '20px',
                boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                transition: 'all 0.2s ease',
                textTransform: 'none',
                padding: '8px 16px',
                fontWeight: 500
              }}
            >
              Add Publication
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Extra Sections */}
      <Accordion expanded={expanded === 'extraSections'} onChange={handleChange('extraSections')} sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Extra Sections</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {(data.extraSections || []).map((section, sectionIndex) => (
              <Paper key={sectionIndex} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Section Title"
                    value={section.title}
                    onChange={(e) => updateExtraSection(sectionIndex, 'title', e.target.value)}
                    sx={textFieldStyle}
                  />
                  <Box sx={{ display: 'flex', ml: 1 }}>
                    <IconButton
                      onClick={() => moveExtraSection(sectionIndex, 'up')}
                      disabled={sectionIndex === 0}
                      sx={{ color: '#2e7d32' }}
                    >
                      <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => moveExtraSection(sectionIndex, 'down')}
                      disabled={!data.extraSections || sectionIndex === data.extraSections.length - 1}
                      sx={{ color: '#2e7d32' }}
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => removeExtraSection(sectionIndex)}
                      sx={{ color: '#2e7d32' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {section.items.map((item, itemIndex) => (
                    <Paper key={itemIndex} sx={{ p: 2, backgroundColor: '#ffffff' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1">Item #{itemIndex + 1}</Typography>
                        <Box sx={{ display: 'flex' }}>
                          <IconButton
                            onClick={() => moveExtraSectionItem(sectionIndex, itemIndex, 'up')}
                            disabled={itemIndex === 0}
                            sx={{ color: '#2e7d32' }}
                          >
                            <ArrowUpwardIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => moveExtraSectionItem(sectionIndex, itemIndex, 'down')}
                            disabled={itemIndex === section.items.length - 1}
                            sx={{ color: '#2e7d32' }}
                          >
                            <ArrowDownwardIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => removeExtraSectionItem(sectionIndex, itemIndex)}
                            sx={{ color: '#2e7d32' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'grid', gap: 2 }}>
                        <TextField
                          fullWidth
                          label="Title"
                          value={item.title}
                          onChange={(e) => updateExtraSection(sectionIndex, `${itemIndex}.title`, e.target.value)}
                          sx={textFieldStyle}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Description"
                          value={item.description}
                          onChange={(e) => updateExtraSection(sectionIndex, `${itemIndex}.description`, e.target.value)}
                          sx={textFieldStyle}
                        />
                        <TextField
                          fullWidth
                          label="Date"
                          value={item.date}
                          onChange={(e) => updateExtraSection(sectionIndex, `${itemIndex}.date`, e.target.value)}
                          sx={textFieldStyle}
                        />
                      </Box>
                    </Paper>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => addExtraSectionItem(sectionIndex)}
                    sx={{
                      backgroundColor: '#1976d2',
                      '&:hover': { backgroundColor: '#1565c0' },
                      color: 'white',
                      borderRadius: '20px',
                      boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                      transition: 'all 0.2s ease',
                      textTransform: 'none',
                      padding: '8px 16px',
                      fontWeight: 500
                    }}
                  >
                    Add Item
                  </Button>
                </Box>
              </Paper>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addExtraSection}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
                color: 'white',
                borderRadius: '20px',
                boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                transition: 'all 0.2s ease',
                textTransform: 'none',
                padding: '8px 16px',
                fontWeight: 500
              }}
            >
              Add Extra Section
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ResumeForm; 