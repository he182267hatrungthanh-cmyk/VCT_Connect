// A visible cue only. Navigation, login and CAPTCHA remain the user's actions.
export function showCompanyGuidance(mode: "SHOP", expectedShop: string): boolean {
  document.getElementById("vct-company-guidance")?.remove();
  const targets = Array.from(document.querySelectorAll<HTMLAnchorElement>("#shopNavigation a.shop-company-name[href]"))
    .filter(a => a.getClientRects().length && a.href.split("?")[0] === expectedShop);
  const target = targets.length === 1 ? targets[0] : null;
  if (target) {
    target.style.outline = "4px solid #16a085";
    target.style.outlineOffset = "4px";
    target.scrollIntoView({ block: "center", behavior: "smooth" });
  }
  const cue = document.createElement("aside");
  cue.id = "vct-company-guidance";
  cue.setAttribute("role", "status");
  cue.style.cssText = "position:fixed;top:16px;right:16px;z-index:2147483647;background:#fff;color:#163b32;border:3px solid #16a085;border-radius:12px;padding:18px;max-width:360px;font:16px/1.5 sans-serif;box-shadow:0 6px 24px #0004";
  const message = document.createElement("p");
  message.textContent = "VCT Connect: Product captured. Click the highlighted supplier/company name to open its shop. Complete login or CAPTCHA there, then reopen VCT Connect and click Analyze this page.";
  cue.append(message);
  if (!target) {
    const link = document.createElement("a");
    link.href = expectedShop; link.textContent = "Open this product's company page";
    cue.append(link);
  }
  const close = document.createElement("button"); close.textContent = "Dismiss";
  close.onclick = () => { cue.remove(); if (target) { target.style.outline = ""; target.style.outlineOffset = ""; } };
  cue.append(close); document.body.append(cue);
  return Boolean(target);
}
