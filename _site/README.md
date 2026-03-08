# SP26

Welcome to the website for Differential Equations PILOT at the Johns Hopkins University. To access the webpage, use [this link](https://jhu-ode-pilot.github.io/SP26).

## Local development

To run the site locally for testing:

1. **Install Ruby 3.0+** (required). GitHub Pages uses 3.3.4. If you have an older Ruby, use [rbenv](https://github.com/rbenv/rbenv) or [ruby-install](https://github.com/postmodern/ruby-install). Check with `ruby -v`.

2. **Install Bundler** (if needed):
   ```bash
   gem install bundler
   ```

3. **Install dependencies**:
   ```bash
   bundle install
   ```

4. **Serve the site**:
   ```bash
   bundle exec jekyll serve
   ```

   The site will be available at **http://localhost:4000/SP26/** (open this URL in your browser).

5. **Optional: live reload** — `jekyll serve` watches for file changes and rebuilds automatically.

To build without serving:
```bash
bundle exec jekyll build
```