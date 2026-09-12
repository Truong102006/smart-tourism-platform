import { ArrowClockwise, MapPinLine } from '@phosphor-icons/react'

interface InlineStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export const InlineState: React.FC<InlineStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div className="inline-state" role="status">
    <MapPinLine size={34} weight="duotone" aria-hidden="true" />
    <h2>{title}</h2>
    <p>{description}</p>
    {actionLabel && onAction ? (
      <button className="button button-secondary" type="button" onClick={onAction}>
        <ArrowClockwise size={18} aria-hidden="true" />
        {actionLabel}
      </button>
    ) : null}
  </div>
)
