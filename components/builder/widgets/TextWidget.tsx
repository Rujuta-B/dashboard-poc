interface TextWidgetProps {
  config: {
    content?: string
    fontSize?: 'small' | 'medium' | 'large'
    alignment?: 'left' | 'center' | 'right'
  }
}

export function TextWidget({ config }: TextWidgetProps) {
  const content = config.content || 'Add your text here...'
  const fontSize = config.fontSize || 'medium'
  const alignment = config.alignment || 'left'

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm'
      case 'large': return 'text-lg'
      default: return 'text-base'
    }
  }

  const getAlignmentClass = () => {
    switch (alignment) {
      case 'center': return 'text-center'
      case 'right': return 'text-right'
      default: return 'text-left'
    }
  }

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <div 
        className={`${getFontSizeClass()} ${getAlignmentClass()} text-gray-800 leading-relaxed`}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {content}
      </div>
    </div>
  )
}