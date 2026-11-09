# fc-clean-architecture

## Executando os testes

Instale as dependências do projeto:

```bash
npm install
```

Execute a suíte completa:

```bash
npm test
```

Esse comando verifica os tipos TypeScript e, em seguida, executa os testes com Jest.

Para executar um arquivo de teste específico:

```bash
npx jest src/domain/product/entity/product.spec.ts --runInBand
```

Substitua o caminho pelo arquivo de teste desejado. A opção `--runInBand` executa os testes em sequência.
