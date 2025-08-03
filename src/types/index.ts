// Content Processing Types
export interface ContentData {
  id: string
  rawContent: string
  processedContent: string
  characterCount: number
  wordCount: number
  lineCount: number
  createdAt: Date
  updatedAt: Date
}

// Processing Options
export interface ProcessingOptions {
  removeWhitespace: boolean
  normalizeLineBreaks: boolean
  removeSpecialChars: boolean
  convertToUppercase: boolean
  convertToLowercase: boolean
  convertToTitleCase: boolean
  removeDuplicates: boolean
  sortLines: boolean
  countWords: boolean
}

// Metadata Types
export interface Metadata {
  title: string
  description: string
  keywords: string[]
  author: string
  tags: string[]
  category: string
  language: string
}

// Metatag Pack
export interface MetatagPack {
  id: string
  name: string
  description: string
  tags: string[]
  metadata: Metadata
  isDefault?: boolean
}

// Template Types
export interface Template {
  id: string
  name: string
  description: string
  content: string
  category: string
  tags: string[]
  isDefault?: boolean
}

// Processing Result
export interface ProcessingResult {
  success: boolean
  processedContent: string
  metadata?: Metadata
  statistics: {
    originalLength: number
    processedLength: number
    wordsRemoved: number
    linesRemoved: number
    processingTime: number
  }
  errors?: string[]
  appliedOperations?: string[]
}

// Form Validation
export interface ValidationState {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Loading States
export interface LoadingStates {
  isProcessing: boolean
  isSaving: boolean
  isLoadingTemplates: boolean
  isLoadingMetatags: boolean
  isExporting: boolean
}

// Application State
export interface AppState {
  content: ContentData
  processingOptions: ProcessingOptions
  metadata: Metadata
  templates: Template[]
  metatagPacks: MetatagPack[]
  loadingStates: LoadingStates
  validation: ValidationState
  selectedTemplate?: string
  selectedMetatagPack?: string
} 