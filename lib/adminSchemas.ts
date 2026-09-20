import { UI_DEFAULTS } from './defaults';

export type Option = { value: string; label: string };

type Base = { label: string; help?: string; placeholder?: string };

export type FieldDef =
  | (Base & { type: 'text' | 'textarea' | 'url' | 'number'; key: string })
  | (Base & { type: 'localized' | 'localized_textarea'; key: string })
  | (Base & { type: 'image'; key: string; dims?: boolean })
  | (Base & { type: 'select'; key: string; options: Option[] })
  | (Base & { type: 'toggle'; key: string })
  | (Base & {
      type: 'list';
      key: string;
      addLabel?: string;
      /** primitive item (a single localized text or image ...) */
      of?: Omit<FieldDef, 'key'> & { key?: string };
      /** object item with several fields */
      fields?: FieldDef[];
      /** key of the sub-field shown as the row title */
      titleKey?: string;
    });

export type SectionSchema = { type: string; label: string; description: string; fields: FieldDef[] };

const loc = (key: string, label: string, help?: string): FieldDef => ({ type: 'localized', key, label, help });
const locArea = (key: string, label: string, help?: string): FieldDef => ({ type: 'localized_textarea', key, label, help });
const img = (key: string, label: string, help?: string, dims = false): FieldDef => ({ type: 'image', key, label, help, dims });
const link = (key: string, label: string): FieldDef => ({
  type: 'url', key, label,
  help: 'Կայքի էջ (օր.՝ contact, services/led-displays) կամ ամբողջական հղում (https://…)',
});
const paragraphs: FieldDef = {
  type: 'list', key: 'paragraphs', label: 'Պարբերություններ', addLabel: '+ Պարբերություն',
  of: { type: 'localized_textarea', label: 'Պարբերություն' },
};

export const SECTION_SCHEMAS: SectionSchema[] = [
  {
    type: 'hero', label: 'Գլխավոր էկրան', description: 'Մեծ նկար, վերնագիր, կոճակներ և ուղղությունների շերտ (գլխավոր էջի համար)',
    fields: [
      loc('eyebrow', 'Փոքր տող վերնագրի վերևում'),
      locArea('title', 'Վերնագիր'),
      locArea('subtitle', 'Ենթավերնագիր'),
      loc('cta_label', 'Հիմնական կոճակ՝ տեքստ'), link('cta_url', 'Հիմնական կոճակ՝ հղում'),
      loc('cta2_label', 'Երկրորդ կոճակ՝ տեքստ'), link('cta2_url', 'Երկրորդ կոճակ՝ հղում'),
      img('image', 'Հիմնական նկար', 'Օգտագործվում է, եթե ներքևի ուղղությունների ցանկը դատարկ է'),
      {
        type: 'list', key: 'slides', label: 'Ուղղությունների շերտ (հերոյի ներքևում)', addLabel: '+ Ուղղություն', titleKey: 'label',
        fields: [loc('label', 'Անվանում'), img('image', 'Նկար'), link('url', 'Հղում')],
      },
    ],
  },
  {
    type: 'page_hero', label: 'Էջի վերնագրի բաժին', description: 'Ներքին էջերի վերևի վերնագիրը՝ նկարով',
    fields: [loc('eyebrow', 'Փոքր տող վերնագրի վերևում'), loc('title', 'Վերնագիր', 'Դատարկ թողնելու դեպքում կօգտագործվի էջի անվանումը'), locArea('subtitle', 'Ենթավերնագիր'), img('image', 'Նկար')],
  },
  {
    type: 'text', label: 'Տեքստ', description: 'Վերնագիր և պարբերություններ՝ նկարով կամ առանց',
    fields: [
      loc('title', 'Վերնագիր'), paragraphs,
      img('image', 'Նկար (ըստ ցանկության)'),
      { type: 'select', key: 'image_position', label: 'Նկարի դիրքը', options: [{ value: 'right', label: 'Աջ' }, { value: 'left', label: 'Ձախ' }] },
      { type: 'select', key: 'background', label: 'Ֆոն', options: [{ value: 'white', label: 'Սպիտակ' }, { value: 'wash', label: 'Բաց մոխրագույն' }] },
      loc('cta_label', 'Հղման տեքստ'), link('cta_url', 'Հղում'),
    ],
  },
  {
    type: 'feature_split', label: 'Ընդգծված բլոկ', description: 'Մուգ կամ բաց բլոկ՝ նկարով և տեքստով',
    fields: [
      loc('title', 'Վերնագիր'), paragraphs, img('image', 'Նկար'),
      { type: 'select', key: 'image_position', label: 'Նկարի դիրքը', options: [{ value: 'left', label: 'Ձախ' }, { value: 'right', label: 'Աջ' }] },
      { type: 'select', key: 'theme', label: 'Ոճ', options: [{ value: 'dark', label: 'Մուգ' }, { value: 'light', label: 'Բաց' }] },
      loc('cta_label', 'Հղման տեքստ'), link('cta_url', 'Հղում'),
    ],
  },
  {
    type: 'services', label: 'Ծառայությունների ցանկ', description: 'Ցույց է տալիս «Ծառայություններ» բաժնի բոլոր ուղղությունները (խմբագրվում է առանձին էջում)',
    fields: [loc('title', 'Վերնագիր'), locArea('subtitle', 'Ենթավերնագիր')],
  },
  {
    type: 'gallery', label: 'Պատկերասրահ', description: 'Լուսանկարների ցանց՝ մեծացմամբ',
    fields: [
      loc('title', 'Վերնագիր'),
      {
        type: 'list', key: 'images', label: 'Լուսանկարներ', addLabel: '+ Լուսանկար', titleKey: 'caption',
        fields: [img('image', 'Նկար', undefined, true), loc('caption', 'Ստորագրություն (ըստ ցանկության)'), loc('alt', 'Նկարագրություն (alt, ըստ ցանկության)', 'Օգնում է որոնողական համակարգերին և տեսողության խնդիր ունեցողներին')],
      },
    ],
  },
  {
    type: 'stats', label: 'Թվեր', description: 'Կարճ ցուցանիշների շերտ',
    fields: [{
      type: 'list', key: 'items', label: 'Ցուցանիշներ', addLabel: '+ Ցուցանիշ', titleKey: 'value',
      fields: [loc('value', 'Արժեք (օր.՝ 2011)'), loc('label', 'Նկարագրություն')],
    }],
  },
  {
    type: 'customers', label: 'Պատվիրատուներ', description: 'Պատվիրատուների լոգոների ցանց',
    fields: [
      loc('title', 'Վերնագիր'), locArea('subtitle', 'Ենթավերնագիր'),
      {
        type: 'list', key: 'items', label: 'Պատվիրատուներ', addLabel: '+ Պատվիրատու', titleKey: 'name',
        fields: [{ type: 'text', key: 'name', label: 'Անվանում' }, img('logo', 'Լոգո')],
      },
    ],
  },
  {
    type: 'timeline', label: 'Ժամանակագրություն', description: 'Երեք հանգրվան՝ տարեթվով',
    fields: [
      loc('title', 'Վերնագիր'),
      {
        type: 'list', key: 'items', label: 'Հանգրվաններ', addLabel: '+ Հանգրվան', titleKey: 'year',
        fields: [{ type: 'text', key: 'year', label: 'Տարեթիվ / նշան' }, loc('title', 'Վերնագիր'), locArea('description', 'Նկարագրություն')],
      },
    ],
  },
  {
    type: 'bullets', label: 'Ցանկ', description: 'Վերնագիր և կետերի ցանկ (օր.՝ աշխատանքների շրջանակ)',
    fields: [loc('title', 'Վերնագիր'), { type: 'list', key: 'items', label: 'Կետեր', addLabel: '+ Կետ', of: { type: 'localized', label: 'Կետ' } }],
  },
  {
    type: 'cta', label: 'Կոչ գործողության', description: 'Մուգ շերտ՝ վերնագրով և կոճակով',
    fields: [loc('title', 'Վերնագիր'), locArea('description', 'Նկարագրություն'), loc('cta_label', 'Կոճակի տեքստ'), link('cta_url', 'Կոճակի հղում')],
  },
  {
    type: 'contact', label: 'Կոնտակտներ', description: 'Հեռախոս, էլ. փոստ, հասցե (տվյալները վերցվում են «Կարգավորումներից»)',
    fields: [loc('title', 'Վերնագիր'), locArea('description', 'Նկարագրություն')],
  },
  {
    type: 'company_details', label: 'Կազմակերպության տվյալներ', description: 'Ռեկվիզիտներ (տվյալները վերցվում են «Կարգավորումներից»)',
    fields: [loc('title', 'Վերնագիր')],
  },
];

/** Legacy section names that are rendered by another type. */
export const TYPE_ALIASES: Record<string, string> = { intro: 'text', rich_text: 'text' };

export const schemaFor = (type: string): SectionSchema | undefined =>
  SECTION_SCHEMAS.find((s) => s.type === (TYPE_ALIASES[type] ?? type));

/** Sensible starting content for a new section. */
export function emptyContent(type: string): Record<string, unknown> {
  const tri = { hy: '', en: '', ru: '' };
  switch (type) {
    case 'text': return { title: { ...tri }, paragraphs: [{ ...tri }], image: '', image_position: 'right', background: 'white' };
    case 'feature_split': return { title: { ...tri }, paragraphs: [{ ...tri }], image: '', image_position: 'left', theme: 'dark' };
    case 'gallery': return { title: { ...tri }, images: [] };
    case 'stats': return { items: [{ value: { ...tri }, label: { ...tri } }] };
    case 'customers': return { title: { ...tri }, subtitle: { ...tri }, items: [] };
    case 'timeline': return { title: { ...tri }, items: [] };
    case 'bullets': return { title: { ...tri }, items: [{ ...tri }] };
    case 'hero': return { eyebrow: { ...tri }, title: { ...tri }, subtitle: { ...tri }, cta_label: { ...tri }, cta_url: '/services', cta2_label: { ...tri }, cta2_url: '/contact', image: '', slides: [] };
    default: return { title: { ...tri } };
  }
}

// ------------------------------------------------------------------ site settings

export type SettingsGroup = { id: string; label: string; fields: FieldDef[] };

const t = (key: string, label: string, help?: string): FieldDef => ({ type: 'text', key, label, help });

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: 'company', label: 'Ընկերություն',
    fields: [
      loc('company.name', 'Կազմակերպության անվանումը'), loc('company.short_name', 'Կարճ անվանում'),
      locArea('company.tagline', 'Նկարագրություն (ցուցադրվում է footer-ում)'),
      { type: 'number', key: 'company.established_year', label: 'Հիմնադրման տարին' },
      t('company.tax_id', 'ՀՎՀՀ'), t('company.registration', 'Պետ. ռեգ. գրանցման համար'),
      loc('company.director', 'Ղեկավարի ա.ա.հ.'), loc('company.director_position', 'Ղեկավարի պաշտոնը'),
      loc('company.chief_accountant', 'Հաշվապահի ա.ա.հ.'), loc('company.chief_accountant_position', 'Հաշվապահի պաշտոնը'),
    ],
  },
  {
    id: 'contact', label: 'Կապ',
    fields: [
      t('contact.phone', 'Հեռախոս', 'Միջազգային ձևաչափով, օր.՝ +37499694569'),
      { type: 'text', key: 'contact.email', label: 'Էլեկտրոնային փոստ' },
      loc('contact.business_address', 'Գործնական հասցե'), loc('contact.legal_address', 'Իրավաբանական հասցե'),
    ],
  },
  {
    id: 'bank', label: 'Բանկային տվյալներ',
    fields: [loc('bank.name', 'Բանկ'), t('bank.account_amd', 'Հաշվարկային հաշիվ (AMD)'), t('bank.account_usd', 'Հաշվարկային հաշիվ (USD)'), t('bank.account_eur', 'Հաշվարկային հաշիվ (EUR)')],
  },
  {
    id: 'brand', label: 'Լոգո և ստորին հատված',
    fields: [
      img('brand.logo', 'Լոգո (բաց ֆոնի համար)', 'Թափանցիկ PNG՝ մուգ գույնով. ցուցադրվում է վերևի մենյուում'),
      img('brand.logo_light', 'Լոգո (մուգ ֆոնի համար)', 'Թափանցիկ PNG՝ սպիտակ գույնով. ցուցադրվում է footer-ում'),
      loc('footer.bottom_text', 'Footer-ի ստորին տող'),
    ],
  },
  {
    id: 'seo', label: 'SEO',
    fields: [
      loc('seo.site_name', 'Կայքի անվանումը (որոնողական համակարգերի և սոց. ցանցերի համար)'),
      locArea('seo.default_description', 'Կայքի կարճ նկարագրությունը'),
      img('seo.og_image', 'Նկար՝ հղումը սոց. ցանցերում կիսելու համար'),
    ],
  },
];

export const UI_LABEL_HELP: Record<string, string> = {
  learn_more: 'Ծառայության քարտի հղում', contact_us: 'Կոճակ՝ «Կապ մեզ հետ»', call_us: 'Կոճակ՝ զանգահարել', email_us: 'Կոճակ՝ գրել',
  areas_of_activity: 'Հերոյի ուղղությունների շերտի անվանումը', navigation: 'Footer-ի մենյուի վերնագիր',
};

export const UI_KEYS = Object.keys(UI_DEFAULTS) as Array<keyof typeof UI_DEFAULTS>;
