export default {
  name: 'voucher',
  title: 'Ваучери',
  type: 'document',
  fields: [
    { name: 'code', title: 'Код', type: 'string', readOnly: true },
    {
      name: 'type',
      title: 'Тип',
      type: 'string',
      options: { list: [{ title: 'За работилница', value: 'workshop' }, { title: 'На стойност', value: 'value' }] },
    },
    { name: 'value', title: 'Стойност (€)', type: 'number' },
    { name: 'recipientName', title: 'Получател — имена', type: 'string' },
    { name: 'recipientEmail', title: 'Получател — имейл', type: 'string' },
    { name: 'senderName', title: 'Подател — имена', type: 'string' },
    { name: 'senderEmail', title: 'Подател — имейл', type: 'string' },
    { name: 'message', title: 'Послание', type: 'text' },
    { name: 'used', title: 'Използван', type: 'boolean', initialValue: false },
    { name: 'paidAt', title: 'Платен на', type: 'datetime', readOnly: true },
  ],
  preview: {
    select: { title: 'code', subtitle: 'recipientEmail' },
  },
}
