import { css } from "catom";

export function Footer() {
  return (
    <footer class={css({ marginTop: "2rem" })}>
      <div>
        <div>
          <a href="https://hydrophobefireman.me">author</a>
        </div>
        <a href="https://github.com/hydrophobefireman/collegewarden-frontend">
          source code (website)
        </a>
        <div>
          <a href="https://github.com/hydrophobefireman/collegewarden-backend">
            source code (server)
          </a>
        </div>
      </div>
    </footer>
  );
}
