--
-- PostgreSQL database dump
--

\restrict 81QypfkzaPUfIwadaXxJeyaiiKSf1lMB1vCGNJIvBiiR2NZwLKwvPM7TUska5d6

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.services (id, name, department, type, fee, "effectiveFrom", active, "createdAt", "updatedAt") VALUES ('1d9cddee-8a61-4d7f-aa4a-90d67f52c50f', 'Consultation - General Outpatient', 'gopd', 'consultation', 5000, '2026-01-01', true, '2026-10-15 02:27:38.116762', '2026-10-15 02:27:38.116762');
INSERT INTO public.services (id, name, department, type, fee, "effectiveFrom", active, "createdAt", "updatedAt") VALUES ('34b65c1d-f498-4fd8-99d1-70795d167cf9', 'Full blood count', 'laboratory', 'test', 4500, '2026-01-01', true, '2026-10-15 02:27:38.116762', '2026-10-15 02:27:38.116762');
INSERT INTO public.services (id, name, department, type, fee, "effectiveFrom", active, "createdAt", "updatedAt") VALUES ('a84a98ec-4c62-4c48-b599-1841cf4ddafb', 'Urea and electrolytes', 'laboratory', 'test', 7000, '2026-01-01', true, '2026-10-15 02:27:38.116762', '2026-10-15 02:27:38.116762');
INSERT INTO public.services (id, name, department, type, fee, "effectiveFrom", active, "createdAt", "updatedAt") VALUES ('1cc0ccb2-1f3f-447e-a47c-c40d775e905f', 'Malaria RDT', 'laboratory', 'test', 2000, '2026-01-01', true, '2026-10-15 02:27:38.116762', '2026-10-15 02:27:38.116762');
INSERT INTO public.services (id, name, department, type, fee, "effectiveFrom", active, "createdAt", "updatedAt") VALUES ('b5494c36-0899-408d-8458-baf8068ec3e9', 'Chest X-ray', 'radiology', 'imaging', 7000, '2026-03-01', true, '2026-10-15 02:27:38.116762', '2026-10-15 02:27:38.116762');
INSERT INTO public.services (id, name, department, type, fee, "effectiveFrom", active, "createdAt", "updatedAt") VALUES ('bb1b9c6c-da43-4032-82ae-3fef18b18516', 'Abdominal ultrasound', 'radiology', 'imaging', 12000, '2026-01-01', true, '2026-10-15 02:27:38.116762', '2026-10-15 02:27:38.116762');
INSERT INTO public.services (id, name, department, type, fee, "effectiveFrom", active, "createdAt", "updatedAt") VALUES ('6c1e1b20-568b-427a-a8bf-5b8e448bfda0', 'Bed - Medical Ward', 'medical_ward', 'bed_day', 15000, '2026-01-01', true, '2026-10-15 02:27:38.116762', '2026-10-15 02:27:38.116762');
INSERT INTO public.services (id, name, department, type, fee, "effectiveFrom", active, "createdAt", "updatedAt") VALUES ('e8caa668-74ee-46ff-a5a3-01a3f1690cfb', 'Nursing care - general', 'medical_ward', 'bed_day', 62800, '2026-01-01', true, '2026-10-15 02:27:38.116762', '2026-10-15 02:27:38.116762');


--
-- Data for Name: analytes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.analytes (id, "serviceId", name, "valueType", unit, "refLow", "refHigh", "criticalLow", "criticalHigh", "abnormalValues", "sortOrder") VALUES ('c4ba8ded-ac4f-4db5-bec1-80d232e8152d', '34b65c1d-f498-4fd8-99d1-70795d167cf9', 'Packed cell volume', 'numeric', '%', 36, 46, NULL, NULL, NULL, 4);
INSERT INTO public.analytes (id, "serviceId", name, "valueType", unit, "refLow", "refHigh", "criticalLow", "criticalHigh", "abnormalValues", "sortOrder") VALUES ('1de8036f-1b91-48a4-a2b6-2611f18ec010', '34b65c1d-f498-4fd8-99d1-70795d167cf9', 'Platelets', 'numeric', 'x10^9/L', 150, 400, NULL, NULL, NULL, 3);
INSERT INTO public.analytes (id, "serviceId", name, "valueType", unit, "refLow", "refHigh", "criticalLow", "criticalHigh", "abnormalValues", "sortOrder") VALUES ('97c6a4ff-8a4c-43c2-b752-885c1fe33d86', '34b65c1d-f498-4fd8-99d1-70795d167cf9', 'White cell count', 'numeric', 'x10^9/L', 4, 11, NULL, NULL, NULL, 2);
INSERT INTO public.analytes (id, "serviceId", name, "valueType", unit, "refLow", "refHigh", "criticalLow", "criticalHigh", "abnormalValues", "sortOrder") VALUES ('01a500a4-da81-441d-aa91-96aa377ae05d', '34b65c1d-f498-4fd8-99d1-70795d167cf9', 'Haemoglobin', 'numeric', 'g/dL', 12, 15.5, NULL, NULL, NULL, 1);


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.permissions (id, key, label, "sortOrder") VALUES ('7f8da6cb-e891-4aef-ae77-c8ef2113090b', 'view_patient', 'View patient', 1);
INSERT INTO public.permissions (id, key, label, "sortOrder") VALUES ('24e6bbae-0dea-47c7-8216-cdd64eebd1c6', 'edit_patient', 'Edit patient', 2);
INSERT INTO public.permissions (id, key, label, "sortOrder") VALUES ('621510c3-0fda-45ff-a484-c3a49905e169', 'clinical_notes', 'Clinical notes', 3);
INSERT INTO public.permissions (id, key, label, "sortOrder") VALUES ('34187390-b848-4ebb-9f5b-07e966261cd5', 'prescribe', 'Prescribe', 4);
INSERT INTO public.permissions (id, key, label, "sortOrder") VALUES ('eb79b874-bd8f-4796-9608-68bf9b36ff1f', 'enter_results', 'Enter results', 5);
INSERT INTO public.permissions (id, key, label, "sortOrder") VALUES ('335b8a36-b84d-4333-904b-5420adb9cab1', 'verify_results', 'Verify results', 6);
INSERT INTO public.permissions (id, key, label, "sortOrder") VALUES ('6574bef7-5e87-46a5-ab1b-8e471977d9c6', 'dispense', 'Dispense', 7);
INSERT INTO public.permissions (id, key, label, "sortOrder") VALUES ('e1e822a2-fc7f-42f4-85c9-7c966ee43bc7', 'manage_users', 'Manage users', 8);
INSERT INTO public.permissions (id, key, label, "sortOrder") VALUES ('25caf0f3-1010-48b4-8879-1790d9381f25', 'order_tests', 'Order tests', 9);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products (id, name, category, unit, price, "allergyClass", active, "createdAt", "updatedAt") VALUES ('7c578e5f-08a8-4037-bd76-7ea7d052fa70', 'Ceftriaxone 1g', 'injectable', 'vial', 3500, 'cephalosporin', true, '2026-10-15 11:25:39.784615', '2026-10-15 11:25:39.784615');
INSERT INTO public.products (id, name, category, unit, price, "allergyClass", active, "createdAt", "updatedAt") VALUES ('a5183613-eb8b-459e-8fd2-a708fc63016e', 'Amlodipine 5mg', 'tablet', 'tablet', 50, NULL, true, '2026-10-15 11:25:39.784615', '2026-10-15 11:25:39.784615');
INSERT INTO public.products (id, name, category, unit, price, "allergyClass", active, "createdAt", "updatedAt") VALUES ('01a28c01-dc8a-49cb-bd5e-01fa9e4fa6e2', 'Artemether injection', 'injectable', 'ampoule', 1200, NULL, true, '2026-10-15 11:25:39.784615', '2026-10-15 11:25:39.784615');
INSERT INTO public.products (id, name, category, unit, price, "allergyClass", active, "createdAt", "updatedAt") VALUES ('5515adf3-9529-4fb8-b825-dbbf4a33e91e', 'Paracetamol 500mg', 'tablet', 'tablet', 20, NULL, true, '2026-10-15 11:25:39.784615', '2026-10-15 11:25:39.784615');
INSERT INTO public.products (id, name, category, unit, price, "allergyClass", active, "createdAt", "updatedAt") VALUES ('bb2163da-e74c-4757-99b6-6fe1e831381f', 'Normal saline 500ml', 'fluid', 'bag', 800, NULL, true, '2026-10-15 11:25:39.784615', '2026-10-15 11:25:39.784615');
INSERT INTO public.products (id, name, category, unit, price, "allergyClass", active, "createdAt", "updatedAt") VALUES ('5359509e-4684-4758-b7fb-5b1f25f1149d', 'Amoxicillin 500mg', 'capsule', 'capsule', 80, 'penicillin', true, '2026-10-15 11:25:39.784615', '2026-10-15 11:25:39.784615');


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('9ffadba2-823e-4906-8a92-9a239d0bcd49', 'admin', 'manage_users', 'full', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('bb3202b8-2eec-47e6-a2f0-81b696cbbcef', 'doctor', 'view_patient', 'full', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('75cefc89-e15e-4725-bf99-857e0c66d68f', 'doctor', 'clinical_notes', 'full', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('73f60da3-20af-42e8-a090-39e642eb6b1c', 'doctor', 'prescribe', 'full', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('9ae8e75a-33fa-4c10-bafb-3ce404107199', 'nurse', 'view_patient', 'full', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('a9118de3-102c-4cdc-9da4-be410ddcc289', 'receptionist', 'view_patient', 'full', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('90766ea5-8aff-40ca-96ea-f38dedacaee3', 'receptionist', 'edit_patient', 'full', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('e316357f-ac07-4de5-ab38-b9ab7e111a8c', 'pharmacist', 'dispense', 'full', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('e484fdb3-b1ef-48c4-b6c3-e84dd988e348', 'lab_scientist', 'enter_results', 'full', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('1250bbbc-e641-482f-8b9d-3c1acfe9f2d9', 'lab_scientist', 'verify_results', 'full', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('fb2c7fb7-2194-4bcd-bd9c-68bbd8c8daf9', 'doctor', 'order_tests', 'full', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('b81dad5c-fda1-406d-b239-fdd61cb8a26b', 'admin', 'clinical_notes', 'none', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('6b579c77-9fce-4bba-8efb-9ec97b3b544f', 'admin', 'prescribe', 'none', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('e1c1caa5-67d9-4645-a2ef-5a372f248762', 'admin', 'enter_results', 'none', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('9f2ed3d5-a548-49bd-a459-96ed84fc6709', 'admin', 'verify_results', 'none', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('0faf546f-e390-4dbd-984f-a999e5fb5885', 'admin', 'dispense', 'none', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('078b8316-3edb-4462-b1e9-bdba3c1aac05', 'admin', 'order_tests', 'none', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('f105f997-9f77-4c1f-88d1-c32ad1119553', 'doctor', 'enter_results', 'none', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('6e617d07-a85d-483e-b46f-4348b35814df', 'doctor', 'verify_results', 'none', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('65a13615-3e61-4318-93ee-3ed3eea38adb', 'doctor', 'dispense', 'none', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('bcf5879b-7128-473e-9802-72b7113a689d', 'doctor', 'manage_users', 'none', NULL);
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('d14049bf-1c31-4e9f-8ddf-bbf7a23044a9', 'doctor', 'edit_patient', 'limited', 'Demographics');
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('56542533-ce9e-4561-b83e-e17719517de0', 'nurse', 'clinical_notes', 'limited', 'Vitals only');
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('fea9070f-9e77-4cdd-b36a-5751a61a397c', 'pharmacist', 'view_patient', 'limited', 'Name and allergies');
INSERT INTO public.role_permissions (id, "roleKey", "permissionKey", scope, note) VALUES ('1452acf7-3852-4ee5-a344-1938b3c04fa1', 'lab_scientist', 'view_patient', 'limited', 'Name and age');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles (id, key, label, "sortOrder", "createdAt") VALUES ('5a32e148-f226-445c-a12b-cd6c1a1462dc', 'admin', 'Admin', 1, '2026-10-16 04:04:55.320198');
INSERT INTO public.roles (id, key, label, "sortOrder", "createdAt") VALUES ('342da188-a081-4d9c-b145-76fdbcc64bc6', 'doctor', 'Doctor', 2, '2026-10-16 04:04:55.320198');
INSERT INTO public.roles (id, key, label, "sortOrder", "createdAt") VALUES ('55c4a6e1-56c9-42c4-8b5e-65071e33ef53', 'nurse', 'Nurse', 3, '2026-10-16 04:04:55.320198');
INSERT INTO public.roles (id, key, label, "sortOrder", "createdAt") VALUES ('b8d25de2-6eff-4fef-a615-07da17762564', 'receptionist', 'Receptionist', 4, '2026-10-16 04:04:55.320198');
INSERT INTO public.roles (id, key, label, "sortOrder", "createdAt") VALUES ('32a6af17-f81d-40b0-8497-51035fb699ab', 'pharmacist', 'Pharmacist', 5, '2026-10-16 04:04:55.320198');
INSERT INTO public.roles (id, key, label, "sortOrder", "createdAt") VALUES ('fafbb5fa-9039-4dcd-85f5-7f56e003f853', 'lab_scientist', 'Lab Scientist', 6, '2026-10-16 04:04:55.320198');


--
-- PostgreSQL database dump complete
--

\unrestrict 81QypfkzaPUfIwadaXxJeyaiiKSf1lMB1vCGNJIvBiiR2NZwLKwvPM7TUska5d6

