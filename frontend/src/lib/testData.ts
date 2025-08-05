import { FormData } from '../types/form';

export const TEST_DATA: FormData = {
  buyer_name: 'Jean Dupont',
  buyer_address_line_1: '123 rue de la République',
  buyer_postal_code: '75001',
  buyer_city: 'Paris',
  buyer_country: 'FR',
  buyer_email: 'jean.dupont@email.com',

  seller_name: 'TechStore SARL',
  seller_address_line_1: '456 avenue du Commerce',
  seller_postal_code: '69000',
  seller_city: 'Lyon',
  seller_country: 'FR',

  product_name: 'Smartphone XYZ Pro 256GB Noir',
  purchase_date: '2024-06-15',
  product_price: '899',
  product_condition: 'used',

  defect_type: 'fonctionnement',
  defect_description:
    "L'écran présente des lignes verticales noires permanentes qui rendent l'appareil inutilisable. Le problème est apparu spontanément après seulement 2 mois d'utilisation normale, sans aucun choc ni chute. Ces lignes couvrent environ 30% de l'écran et s'aggravent progressivement.",
};
