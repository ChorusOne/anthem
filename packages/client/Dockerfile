FROM anthem-dependencies AS anthem-production-client

COPY . .

# Read from the build environment args
ARG HTTPS
ARG REACT_APP_GRAPHQL_URL
ARG REACT_APP_SENTRY_DSN
ARG REACT_APP_SEGMENT_WRITE_KEY

# Install Netlify CLI
RUN npm i -g netlify-cli

# Build the utils package
RUN yarn utils:build

# Build the client application
RUN yarn client:build

# Deploy the client application:
#
# NOTE: Netlify has the production release branch set to a branch
# which does not exist.
#
# This is because I could not find a way to publish an update to the
# site in CI here while disabling the auto-publishing function, which
# would deploy master without running tests. You can disable
# auto-publishing but that incidentally "locks" the deploy, which
# then causes this cli deploy to not publish the site. As a
# workaround, I just changed the production release branch in Netlify
# to a branch which does not exist. More info:
#
# Locked Deploys: https://www.netlify.com/docs/locked-deploys/
# CLI Issue: https://github.com/netlify/cli/issues/536
#
CMD netlify deploy --prod --site $NETLIFY_SITE_ID --auth $NETLIFY_AUTH_TOKEN --dir packages/client/build --message "Anthem Client Deployed (commit $GITHUB_SHA)"
