import { ConverterPage } from '@/components/form'
import { base64ConverterConfig } from '@/lib/converter-configs'

export default function TextBase64Converter() {
    return <ConverterPage config={base64ConverterConfig} />
}
