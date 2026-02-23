interface Props {
    html: string
}

export const HtmlText = ({html}: Props) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  )
}
