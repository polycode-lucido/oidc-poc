INSERT INTO public."user" (id,username,description,points,created_at,updated_at) VALUES
	 ('2f59a4db-f922-4e1e-adf6-e7f3cb4b91f1'::uuid,'guest','A lambda user with email not verified',0,'2022-06-28 21:30:31.652+02','2022-06-28 21:30:31.652+02'),
	 ('4c75e3f0-d974-40dd-8e6c-27e29c1df764'::uuid,'admin','A special user with all permissions',200,'2022-06-28 21:29:04.963+02','2022-06-28 21:29:04.963+02'),
	 ('f73456d7-7616-470c-8668-de4eb2f78ec7'::uuid,'user','A lambda user with email verified',150,'2022-06-28 21:30:01.184+02','2022-06-28 21:30:01.184+02');

INSERT INTO public.user_emails (id,email,user_id,verification_token,is_verified,created_at,updated_at) VALUES
	 ('509aafb3-a98f-44b4-b8a6-722371c6dddd'::uuid,'guest@gmail.com','2f59a4db-f922-4e1e-adf6-e7f3cb4b91f1'::uuid,'5acab3d5-0dbf-41a2-9984-f066acecc100',false,'2022-06-28 21:30:31.655+02','2022-06-28 21:30:31.655+02'),
	 ('51fdb509-d1f5-4b1f-8998-6867decdd561'::uuid,'user@gmail.com','f73456d7-7616-470c-8668-de4eb2f78ec7'::uuid,NULL,true,'2022-06-28 21:30:01.187+02','2022-06-28 21:36:35.017+02'),
	 ('fc6fd870-3d6d-4501-a85d-0a3b8e2d5528'::uuid,'admin@gmail.com','4c75e3f0-d974-40dd-8e6c-27e29c1df764'::uuid,NULL,true,'2022-06-28 21:29:04.979+02','2022-06-28 21:36:49.469+02');

INSERT INTO public.user_settings (id,user_id,preferred_editing_language,preferred_language,created_at,updated_at) VALUES
	 ('efc05821-8c1e-46b0-83e6-07e8125929f4'::uuid,'4c75e3f0-d974-40dd-8e6c-27e29c1df764'::uuid,'javascript','en'::enum_user_settings_preferred_language,'2022-06-28 21:29:04.987+02','2022-06-28 21:29:04.987+02'),
	 ('38646485-0640-4aff-80e9-48ed940421b5'::uuid,'f73456d7-7616-470c-8668-de4eb2f78ec7'::uuid,'javascript','en'::enum_user_settings_preferred_language,'2022-06-28 21:30:01.191+02','2022-06-28 21:30:01.191+02'),
	 ('6fa7e057-40c2-4954-b19e-40f12ce2dcfb'::uuid,'2f59a4db-f922-4e1e-adf6-e7f3cb4b91f1'::uuid,'javascript','en'::enum_user_settings_preferred_language,'2022-06-28 21:30:31.659+02','2022-06-28 21:30:31.659+02');

INSERT INTO public.auth_subject (id,internal_identifier,"type",created_at,updated_at) VALUES
	 ('e5a46e32-a1d0-40f8-a798-7f28298353ab'::uuid,'4c75e3f0-d974-40dd-8e6c-27e29c1df764'::uuid,'user'::enum_auth_subject_type,'2022-06-28 21:29:04.99+02','2022-06-28 21:29:04.99+02'),
	 ('877962e4-498e-4ba6-86a3-2bef82f8dc96'::uuid,'f73456d7-7616-470c-8668-de4eb2f78ec7'::uuid,'user'::enum_auth_subject_type,'2022-06-28 21:30:01.203+02','2022-06-28 21:30:01.203+02'),
	 ('e79f18b1-cd5d-488e-bc29-34c8b1717ce9'::uuid,'2f59a4db-f922-4e1e-adf6-e7f3cb4b91f1'::uuid,'user'::enum_auth_subject_type,'2022-06-28 21:30:31.661+02','2022-06-28 21:30:31.661+02');

INSERT INTO public.auth_subject_credentials (id,"type","identity",secret,subject_id,created_at,updated_at) VALUES
	 ('e2d281df-748b-4c4a-8fd9-b32975733a36'::uuid,'email_with_password'::enum_auth_subject_credentials_type,'admin@gmail.com','$2b$10$vDTl41O0FuPIbGi9u70lC.AJdnYtlLlwNILphViS1rv/RGuh2KXaa','e5a46e32-a1d0-40f8-a798-7f28298353ab'::uuid,'2022-06-28 21:29:05.065+02','2022-06-28 21:29:05.065+02'),
	 ('c7c9025e-867b-4bcf-a6bb-4c053d9b302c'::uuid,'email_with_password'::enum_auth_subject_credentials_type,'user@gmail.com','$2b$10$lCVZhs5mKch1VceZOx2LB.YXLaKAoETBAe/HjO5X5WLZbuM4GrNS6','877962e4-498e-4ba6-86a3-2bef82f8dc96'::uuid,'2022-06-28 21:30:01.31+02','2022-06-28 21:30:01.31+02'),
	 ('450e1092-d470-4015-bb33-34e2de021387'::uuid,'email_with_password'::enum_auth_subject_credentials_type,'guest@gmail.com','$2b$10$zWwPV8ZmjJc.2JEv5TCxD.vvA1AjI09GHtjD4XKf32eG9YdG6RgIS','e79f18b1-cd5d-488e-bc29-34c8b1717ce9'::uuid,'2022-06-28 21:30:31.748+02','2022-06-28 21:30:31.748+02'),
	 ('7259d1eb-94b0-4a55-ab8c-f49f5f5e5cfa'::uuid,'email_with_password'::enum_auth_subject_credentials_type,'admin','$2b$10$ejcj3HwL3h7w./iH1CUg.eixFG6N7sOjyNpbmslida.g3y2obUbum','e5a46e32-a1d0-40f8-a798-7f28298353ab'::uuid,'2022-06-28 21:29:05.065+02','2022-06-28 21:29:05.065+02'),
	 ('41e9934d-5363-4c83-92c9-fc471a7844c9'::uuid,'email_with_password'::enum_auth_subject_credentials_type,'user','$2b$10$xh6vCPP77aZ6G8y7KyVhBe6.ohktIUm/BhfWQqWRgWv.IteDi9iWy','877962e4-498e-4ba6-86a3-2bef82f8dc96'::uuid,'2022-06-28 21:30:01.31+02','2022-06-28 21:30:01.31+02'),
	 ('89902c1b-0b0c-42a3-b928-cea4ed07caf0'::uuid,'email_with_password'::enum_auth_subject_credentials_type,'guest','$2b$10$mUOC5l14cqKiDMGZJOySyuqPW80iBydh/8UzodsqHGt22nLzquALS','e79f18b1-cd5d-488e-bc29-34c8b1717ce9'::uuid,'2022-06-28 21:30:31.748+02','2022-06-28 21:30:31.748+02');

INSERT INTO public.auth_role (id,"name",description,created_at,updated_at) VALUES
	 ('28fae61c-8f60-4a29-ba0d-09093ada8898'::uuid,'admin','A role for admin','2022-06-20 18:51:25.017+02','2022-06-20 18:51:27.921+02'),
	 ('cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'user','A role for user with email verified ','2022-06-20 18:51:25.017+02','2022-06-20 18:51:27.921+02'),
	 ('db78e634-1034-4bee-9e70-a1d56de1738d'::uuid,'guest','A role for user with email not verified','2022-06-20 18:51:25.017+02','2022-06-20 18:51:27.921+02');

INSERT INTO public.auth_role_policies (id,"action",resource,"attributes",role_id,created_at,updated_at) VALUES
	 ('6191a2f2-6f2c-4218-bc08-73b20b59a6a1'::uuid,'manage'::enum_auth_role_policies_action,'user'::enum_auth_role_policies_resource,NULL,'28fae61c-8f60-4a29-ba0d-09093ada8898'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('386daf5e-a2ee-4cd1-8da2-432e21276e97'::uuid,'manage'::enum_auth_role_policies_action,'user'::enum_auth_role_policies_resource,'{
	"id": "@Replace::@me"
}','cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('42762ee6-42cd-40ed-a557-6a6bdf9d73bc'::uuid,'read'::enum_auth_role_policies_action,'user'::enum_auth_role_policies_resource,'{
	"id": "@Replace::@me"
}','db78e634-1034-4bee-9e70-a1d56de1738d'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('3befa014-fb75-4f87-8ca5-fe35374dc72e'::uuid,'manage'::enum_auth_role_policies_action,'user_email'::enum_auth_role_policies_resource,NULL,'28fae61c-8f60-4a29-ba0d-09093ada8898'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('2746c208-2bb0-4933-ad39-80adf3b7e267'::uuid,'manage'::enum_auth_role_policies_action,'user_email'::enum_auth_role_policies_resource,'{
	"user_id": "@Replace::@me"
}','cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('e923d13e-0286-4e58-b3de-545f8f0ea440'::uuid,'read'::enum_auth_role_policies_action,'user_email'::enum_auth_role_policies_resource,'{
	"user_id": "@Replace::@me"
}','db78e634-1034-4bee-9e70-a1d56de1738d'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('57da9a74-4b22-4434-8340-37210a207810'::uuid,'manage'::enum_auth_role_policies_action,'user_settings'::enum_auth_role_policies_resource,NULL,'28fae61c-8f60-4a29-ba0d-09093ada8898'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('7c761a0f-3ba0-4602-87db-ce89e9f029fe'::uuid,'manage'::enum_auth_role_policies_action,'user_settings'::enum_auth_role_policies_resource,'{
	"user_id": "@Replace::@me"
}','cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('73a0f34d-4f5b-4214-81c7-c0f8b3ec97b6'::uuid,'read'::enum_auth_role_policies_action,'user_settings'::enum_auth_role_policies_resource,'{
	"user_id": "@Replace::@me"
}','db78e634-1034-4bee-9e70-a1d56de1738d'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('846e8fef-4a14-49b6-96e2-cc12a3fda476'::uuid,'manage'::enum_auth_role_policies_action,'module'::enum_auth_role_policies_resource,NULL,'28fae61c-8f60-4a29-ba0d-09093ada8898'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('fbd92c9a-476a-47cf-ae71-0682e37f72bf'::uuid,'read'::enum_auth_role_policies_action,'module'::enum_auth_role_policies_resource,NULL,'cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('93acdec2-d8f2-44ca-ad7b-ddd42ce541fc'::uuid,'manage'::enum_auth_role_policies_action,'user'::enum_auth_role_policies_resource,'{
	"id": "@me"
}','cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('2d0e6638-5f97-4346-9ced-28351567778d'::uuid,'read'::enum_auth_role_policies_action,'user'::enum_auth_role_policies_resource,'{
	"id": "@me"
}','db78e634-1034-4bee-9e70-a1d56de1738d'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('0f23d93b-c17d-4d40-ba6a-e4ade98280dd'::uuid,'manage'::enum_auth_role_policies_action,'user_email'::enum_auth_role_policies_resource,'{
	"user_id": "@me"
}','cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('2320bbef-86a6-444c-b356-19aed553f2a3'::uuid,'read'::enum_auth_role_policies_action,'user_email'::enum_auth_role_policies_resource,'{
	"user_id": "@me"
}','db78e634-1034-4bee-9e70-a1d56de1738d'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('a176f558-0309-4f47-b405-e2dea8b32d58'::uuid,'manage'::enum_auth_role_policies_action,'user_settings'::enum_auth_role_policies_resource,'{
	"user_id": "@me"
}','cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('6a5697aa-9156-410e-9ef6-c03d2d820a2b'::uuid,'read'::enum_auth_role_policies_action,'user_settings'::enum_auth_role_policies_resource,'{
	"user_id": "@me"
}','db78e634-1034-4bee-9e70-a1d56de1738d'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('88dbf5fc-2eb2-478a-8d3a-f8037d013c85'::uuid,'manage'::enum_auth_role_policies_action,'team'::enum_auth_role_policies_resource,NULL,'28fae61c-8f60-4a29-ba0d-09093ada8898'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('8135bd1a-1bf0-4ad4-8972-6da245fd1ce8'::uuid,'create'::enum_auth_role_policies_action,'team'::enum_auth_role_policies_resource,NULL,'cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('b6c2c674-36c8-4df0-92e2-84c2d981ba60'::uuid,'read'::enum_auth_role_policies_action,'user'::enum_auth_role_policies_resource,NULL,'cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('d08aacc9-da7a-4ab3-acb8-62c2cbd3ebe8'::uuid,'read'::enum_auth_role_policies_action,'team'::enum_auth_role_policies_resource,NULL,'cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('f52dbec8-3a27-4fc9-8a27-40f856c7734f'::uuid,'manage'::enum_auth_role_policies_action,'team_member'::enum_auth_role_policies_resource,NULL,'28fae61c-8f60-4a29-ba0d-09093ada8898'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('3f38fbac-024d-416a-b436-96da30ffd499'::uuid,'delete'::enum_auth_role_policies_action,'team_member'::enum_auth_role_policies_resource,'{
	"user_id": "@Replace::@me"
}','cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('e4291cb2-4572-424b-bd5e-40609b8064e7'::uuid,'manage'::enum_auth_role_policies_action,'item'::enum_auth_role_policies_resource,NULL,'28fae61c-8f60-4a29-ba0d-09093ada8898'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('c8c65543-2eaf-4856-81fc-887af4cec613'::uuid,'manage'::enum_auth_role_policies_action,'transaction'::enum_auth_role_policies_resource,NULL,'28fae61c-8f60-4a29-ba0d-09093ada8898'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('cae6afa4-6c73-47bd-8055-aca204bd32cb'::uuid,'manage'::enum_auth_role_policies_action,'content'::enum_auth_role_policies_resource,NULL,'28fae61c-8f60-4a29-ba0d-09093ada8898'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('e0a5f64d-0736-49d9-b1d9-4f802e7cbf2f'::uuid,'manage'::enum_auth_role_policies_action,'submission'::enum_auth_role_policies_resource,NULL,'28fae61c-8f60-4a29-ba0d-09093ada8898'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('fbbd6b06-6dee-4baf-86f6-efc75287403a'::uuid,'read'::enum_auth_role_policies_action,'content'::enum_auth_role_policies_resource,NULL,'cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02'),
	 ('4b5a515e-cd62-4238-983e-f571e8836a66'::uuid,'create'::enum_auth_role_policies_action,'submission'::enum_auth_role_policies_resource,NULL,'cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:20.062+02','2022-06-20 18:55:22.347+02');

INSERT INTO public.auth_subject_roles (id,subject_id,role_id,created_at,updated_at) VALUES
	 ('9a21e99c-644d-4831-8911-3749c759e49b'::uuid,'e5a46e32-a1d0-40f8-a798-7f28298353ab'::uuid,'28fae61c-8f60-4a29-ba0d-09093ada8898'::uuid,'2022-06-20 18:55:22.347+02','2022-06-20 18:55:22.347+02'),
	 ('e7b564d1-951c-4528-9d98-06d6f7079905'::uuid,'877962e4-498e-4ba6-86a3-2bef82f8dc96'::uuid,'cdccf05d-a8b9-4455-a373-595eae252adf'::uuid,'2022-06-20 18:55:22.347+02','2022-06-20 18:55:22.347+02'),
	 ('684b3b26-375a-4713-8878-2d114166ca22'::uuid,'e79f18b1-cd5d-488e-bc29-34c8b1717ce9'::uuid,'db78e634-1034-4bee-9e70-a1d56de1738d'::uuid,'2022-06-20 18:55:22.347+02','2022-06-20 18:55:22.347+02');
