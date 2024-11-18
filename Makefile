create_migration:
	cd crates; sea-orm-cli migrate generate <name of migraiton here>
create_entities:
	sea-orm-cli generate entity -u sqlite://crates/migration/test.db -o crates/server/src/models/_entities --model-extra-derives 'async_graphql::SimpleObject'
create_test_db:
seed_db_with_test_data:
	todo
install_cli_tools:
	cargo install sea-orm-cli
