import { defineConfig } from 'cypress';
import { NormalModuleReplacementPlugin } from 'webpack';
import path from 'path';

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
      webpackConfig: {
        plugins: [
          new NormalModuleReplacementPlugin(
            /next\/image/,
            require.resolve(
              path.join(__dirname, 'cypress', 'fixtures', 'image')
            )
          ),
        ],
      },
    },
  },
});
