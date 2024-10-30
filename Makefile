create_migration:
	cd crates; sea-orm-cli migrate generate <name of migraiton here>	

create_entities:
	sea-orm-cli generate entity -u sqlite://crates/migration/test.db -o crates/database/src/models/_entities

create_test_db:
	$env:DATABASE_URL = "sqlite://crates/migration/test.db?mode=rwc"; cargo run --bin migration

seed_db_with_test_data:
	todo


install_cli_tools:
	cargo install sea-orm-cli