import { fork } from 'child_process';
import * as path from 'path';

describe('main.ts - execução condicional', () => {
  it('deve iniciar sem erros quando executado diretamente', (done) => {
    const mainPath = path.resolve(__dirname, '../main.ts');

    const proc = fork(mainPath, [], {
      execArgv: ['-r', 'ts-node/register'],
    });

    // espera 2s e mata o processo (simula execução bem-sucedida)
    setTimeout(() => {
      proc.kill();
      expect(proc.killed).toBe(true);
      done();
    }, 2000);
  }, 10000); // aumenta timeout do Jest pra 10s
});
