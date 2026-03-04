import { ConverterPage } from '@/components/form'
import { hexConverterConfig } from '@/lib/converter-configs'

export default function TextHexConverter() {
    return <ConverterPage config={hexConverterConfig} />
}
