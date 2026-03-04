import { ConverterPage } from '@/components/form'
import { urlEncoderConfig } from '@/lib/converter-configs'

export default function URLEncoder() {
    return <ConverterPage config={urlEncoderConfig} />
}
