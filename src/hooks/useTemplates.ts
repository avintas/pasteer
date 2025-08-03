import { useState, useCallback, useMemo } from 'react'
import { Template, ValidationState } from '@/types'

// Default templates
const defaultTemplates: Template[] = [
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Standard blog post template with proper formatting',
    content: `# Blog Post Title

## Introduction
Start your blog post with an engaging introduction that hooks your readers.

## Main Content
This is where you'll write your main content. Break it down into sections for better readability.

### Key Points
- Point 1
- Point 2
- Point 3

## Conclusion
Wrap up your blog post with a strong conclusion that reinforces your main message.

---
*Published on [Date] by [Author]*`,
    category: 'blog',
    tags: ['blog', 'article', 'content'],
    isDefault: true,
  },
  {
    id: 'social-media',
    name: 'Social Media Post',
    description: 'Template for engaging social media content',
    content: `🚀 Exciting news!

We're thrilled to announce [your announcement here].

✨ What this means for you:
• Benefit 1
• Benefit 2
• Benefit 3

💬 What do you think? Share your thoughts below!

#hashtag1 #hashtag2 #hashtag3`,
    category: 'social',
    tags: ['social', 'media', 'engagement'],
  },
  {
    id: 'email-newsletter',
    name: 'Email Newsletter',
    description: 'Professional email newsletter template',
    content: `Subject: [Your Newsletter Subject]

Dear [Subscriber Name],

I hope this email finds you well. Here's what's new this week:

## 📰 Latest Updates
[Your updates here]

## 🔗 Quick Links
• [Link 1]
• [Link 2]
• [Link 3]

## 📅 Upcoming Events
[Event details]

Best regards,
[Your Name]
[Your Company]`,
    category: 'email',
    tags: ['email', 'newsletter', 'professional'],
  },
  {
    id: 'technical-doc',
    name: 'Technical Documentation',
    description: 'Template for technical documentation and guides',
    content: `# Technical Documentation

## Overview
Brief description of what this document covers.

## Prerequisites
- Requirement 1
- Requirement 2
- Requirement 3

## Installation
\`\`\`bash
# Installation commands
npm install package-name
\`\`\`

## Usage
\`\`\`javascript
// Example code
const example = new Example();
example.doSomething();
\`\`\`

## Configuration
Describe configuration options here.

## Troubleshooting
Common issues and solutions.

## API Reference
Detailed API documentation.

## Contributing
How others can contribute to this project.`,
    category: 'technical',
    tags: ['documentation', 'technical', 'guide'],
  },
]

export const useTemplates = () => {
  // State management
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  // Template validation using useMemo
  const templateValidation: ValidationState = useMemo(() => {
    const errors: string[] = []
    const warnings: string[] = []

    if (templates.length === 0) {
      warnings.push('No templates available')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }, [templates])

  // Get template by ID function
  const getTemplateById = useCallback((id: string): Template | undefined => {
    return templates.find(template => template.id === id)
  }, [templates])

  // Apply template function
  const applyTemplate = useCallback((templateId: string): string => {
    const template = getTemplateById(templateId)
    if (template) {
      setSelectedTemplate(templateId)
      return template.content
    }
    return ''
  }, [getTemplateById])

  // Add new template function
  const addTemplate = useCallback((template: Omit<Template, 'id'>) => {
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`,
    }
    setTemplates(prev => [...prev, newTemplate])
  }, [])

  // Update template function
  const updateTemplate = useCallback((templateId: string, updates: Partial<Template>) => {
    setTemplates(prev => 
      prev.map(t => t.id === templateId ? { ...t, ...updates } : t)
    )
  }, [])

  // Remove template function
  const removeTemplate = useCallback((templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId))
    if (selectedTemplate === templateId) {
      setSelectedTemplate('')
    }
  }, [selectedTemplate])

  // Get templates by category function
  const getTemplatesByCategory = useCallback((category: string): Template[] => {
    return templates.filter(template => template.category === category)
  }, [templates])

  // Get templates by tag function
  const getTemplatesByTag = useCallback((tag: string): Template[] => {
    return templates.filter(template => template.tags.includes(tag))
  }, [templates])

  // Search templates function
  const searchTemplates = useCallback((query: string): Template[] => {
    const lowercaseQuery = query.toLowerCase()
    return templates.filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }, [templates])

  // Export template function
  const exportTemplate = useCallback((templateId: string) => {
    const template = getTemplateById(templateId)
    if (template) {
      const templateString = JSON.stringify(template, null, 2)
      const blob = new Blob([templateString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }, [getTemplateById])

  // Import template function
  const importTemplate = useCallback((templateData: string) => {
    try {
      const template: Template = JSON.parse(templateData)
      if (template.name && template.content) {
        addTemplate({
          name: template.name,
          description: template.description || '',
          content: template.content,
          category: template.category || 'custom',
          tags: template.tags || [],
        })
        return true
      }
    } catch (error) {
      console.error('Failed to import template:', error)
    }
    return false
  }, [addTemplate])

  // Reset templates function
  const resetTemplates = useCallback(() => {
    setTemplates(defaultTemplates)
    setSelectedTemplate('')
  }, [])

  return {
    // State
    templates,
    selectedTemplate,
    templateValidation,

    // Actions
    getTemplateById,
    applyTemplate,
    addTemplate,
    updateTemplate,
    removeTemplate,
    getTemplatesByCategory,
    getTemplatesByTag,
    searchTemplates,
    exportTemplate,
    importTemplate,
    resetTemplates,
  }
} 