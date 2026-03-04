import { ConverterPage } from '@/components/form'
import { binaryConverterConfig } from '@/lib/converter-configs'

export default function TextBinaryConverter() {
    return <ConverterPage config={binaryConverterConfig} />
}
