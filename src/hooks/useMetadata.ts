import { useState, useCallback, useMemo } from 'react'
import { Metadata, MetatagPack, ValidationState } from '@/types'

// Default metadata
const defaultMetadata: Metadata = {
  title: '',
  description: '',
  keywords: [],
  author: '',
  tags: [],
  category: '',
  language: 'en',
}

// Default metatag packs
const defaultMetatagPacks: MetatagPack[] = [
  {
    id: 'seo-basic',
    name: 'Basic SEO',
    description: 'Essential SEO metadata for web content',
    tags: ['seo', 'basic'],
    metadata: {
      title: '',
      description: '',
      keywords: ['content', 'web'],
      author: '',
      tags: ['seo'],
      category: 'web',
      language: 'en',
    },
    isDefault: true,
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Metadata template for blog articles',
    tags: ['blog', 'article'],
    metadata: {
      title: '',
      description: '',
      keywords: ['blog', 'article'],
      author: '',
      tags: ['blog'],
      category: 'blog',
      language: 'en',
    },
  },
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Optimized metadata for social sharing',
    tags: ['social', 'sharing'],
    metadata: {
      title: '',
      description: '',
      keywords: ['social', 'media'],
      author: '',
      tags: ['social'],
      category: 'social',
      language: 'en',
    },
  },
]

export const useMetadata = () => {
  // State management
  const [metadata, setMetadata] = useState<Metadata>(defaultMetadata)
  const [metatagPacks, setMetatagPacks] = useState<MetatagPack[]>(defaultMetatagPacks)
  const [selectedMetatagPack, setSelectedMetatagPack] = useState<string>('')

  // Metadata validation using useMemo
  const metadataValidation: ValidationState = useMemo(() => {
    const errors: string[] = []
    const warnings: string[] = []

    // Title validation
    if (!metadata.title.trim()) {
      errors.push('Title is required')
    } else if (metadata.title.length < 10) {
      warnings.push('Title is very short (recommended: 10-60 characters)')
    } else if (metadata.title.length > 60) {
      warnings.push('Title is too long (recommended: 10-60 characters)')
    }

    // Description validation
    if (!metadata.description.trim()) {
      errors.push('Description is required')
    } else if (metadata.description.length < 50) {
      warnings.push('Description is very short (recommended: 50-160 characters)')
    } else if (metadata.description.length > 160) {
      warnings.push('Description is too long (recommended: 50-160 characters)')
    }

    // Keywords validation
    if (metadata.keywords.length === 0) {
      warnings.push('No keywords specified')
    } else if (metadata.keywords.length > 10) {
      warnings.push('Too many keywords (recommended: 3-10 keywords)')
    }

    // Author validation
    if (!metadata.author.trim()) {
      warnings.push('Author is not specified')
    }

    // Tags validation
    if (metadata.tags.length === 0) {
      warnings.push('No tags specified')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }, [metadata])

  // Update metadata function using useCallback
  const updateMetadata = useCallback((updates: Partial<Metadata>) => {
    setMetadata(prev => ({ ...prev, ...updates }))
  }, [])

  // Apply metatag pack function
  const applyMetatagPack = useCallback((packId: string) => {
    const pack = metatagPacks.find(p => p.id === packId)
    if (pack) {
      setMetadata(pack.metadata)
      setSelectedMetatagPack(packId)
    }
  }, [metatagPacks])

  // Add new metatag pack function
  const addMetatagPack = useCallback((pack: Omit<MetatagPack, 'id'>) => {
    const newPack: MetatagPack = {
      ...pack,
      id: `pack-${Date.now()}`,
    }
    setMetatagPacks(prev => [...prev, newPack])
  }, [])

  // Remove metatag pack function
  const removeMetatagPack = useCallback((packId: string) => {
    setMetatagPacks(prev => prev.filter(p => p.id !== packId))
    if (selectedMetatagPack === packId) {
      setSelectedMetatagPack('')
    }
  }, [selectedMetatagPack])

  // Update metatag pack function
  const updateMetatagPack = useCallback((packId: string, updates: Partial<MetatagPack>) => {
    setMetatagPacks(prev => 
      prev.map(p => p.id === packId ? { ...p, ...updates } : p)
    )
  }, [])

  // Generate metadata from content function
  const generateMetadataFromContent = useCallback((content: string) => {
    if (!content.trim()) return

    const lines = content.split('\n')
    const firstLine = lines[0].trim()
    const words = content.split(/\s+/).filter(word => word.length > 0)

    // Generate title from first line or first few words
    const title = firstLine.length > 0 && firstLine.length <= 60 
      ? firstLine 
      : words.slice(0, 5).join(' ')

    // Generate description from content
    const description = content.length > 160 
      ? content.substring(0, 157) + '...'
      : content

    // Extract potential keywords (simple implementation)
    const wordFrequency = words.reduce((acc, word) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '')
      if (cleanWord.length > 3) {
        acc[cleanWord] = (acc[cleanWord] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const keywords = Object.entries(wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word)

    updateMetadata({
      title: title || '',
      description: description || '',
      keywords: keywords.length > 0 ? keywords : ['content'],
    })
  }, [updateMetadata])

  // Reset metadata function
  const resetMetadata = useCallback(() => {
    setMetadata(defaultMetadata)
    setSelectedMetatagPack('')
  }, [])

  // Export metadata function
  const exportMetadata = useCallback(() => {
    const metadataString = JSON.stringify(metadata, null, 2)
    const blob = new Blob([metadataString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `metadata-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [metadata])

  return {
    // State
    metadata,
    metatagPacks,
    selectedMetatagPack,
    metadataValidation,

    // Actions
    updateMetadata,
    applyMetatagPack,
    addMetatagPack,
    removeMetatagPack,
    updateMetatagPack,
    generateMetadataFromContent,
    resetMetadata,
    exportMetadata,
  }
} 