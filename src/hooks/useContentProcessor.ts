import { useState, useCallback, useMemo } from 'react'
import { 
  ContentData, 
  ProcessingOptions, 
  ProcessingResult, 
  ValidationState 
} from '@/types'

// Default processing options
const defaultProcessingOptions: ProcessingOptions = {
  removeWhitespace: false,
  normalizeLineBreaks: false,
  removeSpecialChars: false,
  convertToUppercase: false,
  convertToLowercase: false,
  convertToTitleCase: false,
  removeDuplicates: false,
  sortLines: false,
  countWords: false,
}

// Validation rules
const validationRules = {
  maxLength: 6000,
  minLength: 1,
  maxWords: 1000,
}

export const useContentProcessor = () => {
  // State management using useState hooks
  const [content, setContent] = useState<ContentData>({
    id: '',
    rawContent: '',
    processedContent: '',
    characterCount: 0,
    wordCount: 0,
    lineCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>(defaultProcessingOptions)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Real-time validation using useMemo
  const validation: ValidationState = useMemo(() => {
    const errors: string[] = []
    const warnings: string[] = []

    // Only validate if user has interacted with the content
    if (!hasInteracted) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
      }
    }

    // Character count validation
    if (content.rawContent.length > validationRules.maxLength) {
      errors.push(`Content exceeds maximum length of ${validationRules.maxLength} characters`)
    }

    if (content.rawContent.length < validationRules.minLength && content.rawContent.length > 0) {
      warnings.push('Content is very short')
    }

    // Word count validation
    if (content.wordCount > validationRules.maxWords) {
      warnings.push(`Content has ${content.wordCount} words, consider breaking it down`)
    }

    // Content type validation - only show error if user has entered something and then cleared it
    if (content.rawContent.trim().length === 0 && hasInteracted) {
      errors.push('Content cannot be empty')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }, [content.rawContent, content.wordCount, hasInteracted])

  // Content statistics calculation using useMemo
  const contentStats = useMemo(() => {
    const rawContent = content.rawContent
    const characterCount = rawContent.length
    const wordCount = rawContent.trim() ? rawContent.trim().split(/\s+/).length : 0
    const lineCount = rawContent ? rawContent.split('\n').length : 0

    return {
      characterCount,
      wordCount,
      lineCount,
    }
  }, [content.rawContent])

  // Content processing function using useCallback
  const processContent = useCallback(async (): Promise<ProcessingResult> => {
    setIsProcessing(true)
    const startTime = Date.now()

    try {
      let processedText = content.rawContent

      // Apply processing options
      if (processingOptions.removeWhitespace) {
        processedText = processedText.replace(/\s+/g, ' ').trim()
      }

      if (processingOptions.normalizeLineBreaks) {
        processedText = processedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
      }

      if (processingOptions.removeSpecialChars) {
        processedText = processedText.replace(/[^\w\s\n]/g, '')
      }

      if (processingOptions.convertToUppercase) {
        processedText = processedText.toUpperCase()
      }

      if (processingOptions.convertToLowercase) {
        processedText = processedText.toLowerCase()
      }

      if (processingOptions.convertToTitleCase) {
        processedText = processedText
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }

      if (processingOptions.removeDuplicates) {
        const lines = processedText.split('\n')
        const uniqueLines = [...new Set(lines)]
        processedText = uniqueLines.join('\n')
      }

      if (processingOptions.sortLines) {
        const lines = processedText.split('\n')
        processedText = lines.sort().join('\n')
      }

      const processingTime = Date.now() - startTime
      const originalLength = content.rawContent.length
      const processedLength = processedText.length
      const wordsRemoved = contentStats.wordCount - (processedText.trim() ? processedText.trim().split(/\s+/).length : 0)
      const linesRemoved = contentStats.lineCount - processedText.split('\n').length

      const result: ProcessingResult = {
        success: true,
        processedContent: processedText,
        statistics: {
          originalLength,
          processedLength,
          wordsRemoved,
          linesRemoved,
          processingTime,
        },
      }

      setProcessingResult(result)
      return result
    } catch (error) {
      const result: ProcessingResult = {
        success: false,
        processedContent: '',
        statistics: {
          originalLength: content.rawContent.length,
          processedLength: 0,
          wordsRemoved: 0,
          linesRemoved: 0,
          processingTime: Date.now() - startTime,
        },
        errors: [error instanceof Error ? error.message : 'Unknown processing error'],
      }
      setProcessingResult(result)
      return result
    } finally {
      setIsProcessing(false)
    }
  }, [content.rawContent, processingOptions, contentStats])

  // Update content function
  const updateContent = useCallback((newContent: string) => {
    // Mark that user has interacted with the content
    if (!hasInteracted) {
      setHasInteracted(true)
    }

    const stats = {
      characterCount: newContent.length,
      wordCount: newContent.trim() ? newContent.trim().split(/\s+/).length : 0,
      lineCount: newContent ? newContent.split('\n').length : 0,
    }

    setContent(prev => ({
      ...prev,
      rawContent: newContent,
      ...stats,
      updatedAt: new Date(),
    }))
  }, [hasInteracted])

  // Update processing options function
  const updateProcessingOptions = useCallback((options: Partial<ProcessingOptions>) => {
    setProcessingOptions(prev => ({ ...prev, ...options }))
  }, [])

  // Reset content function
  const resetContent = useCallback(() => {
    setContent({
      id: '',
      rawContent: '',
      processedContent: '',
      characterCount: 0,
      wordCount: 0,
      lineCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    setProcessingResult(null)
    setHasInteracted(false)
  }, [])

  return {
    // State
    content,
    processingOptions,
    isProcessing,
    processingResult,
    validation,
    contentStats,
    hasInteracted,

    // Actions
    updateContent,
    updateProcessingOptions,
    processContent,
    resetContent,
    
    // State setters for direct access
    setIsProcessing,
    setProcessingResult,
  }
} 