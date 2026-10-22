You are an intent-alignment auditor. You have no other context about how this change was produced. Here is the verbatim intent this work started from:

**Problem:** The extraction retrospective identified five confirmed CSS visibility defects, a confirmed decompression allocation defect, unresolved browser runtime/failure qualification, current live extension acceptance gaps and stale completion records.

**Approach:** Apply the six approved proposals as tracked follow-ups: correct effective screen visibility and bound decoded allocation; qualify forced runner death, slow cleanup and allocation failure; prepare a compatible-runtime decision; execute available extension checks and preserve session-dependent acceptance; apply an evidence-based epic completion gate.

The diff is the unified diff at `diff --git a/.github/workflows/ci.yml b/.github/workflows/ci.yml
index e69a1b7..181fed9 100644
--- a/.github/workflows/ci.yml
+++ b/.github/workflows/ci.yml
@@ -56,13 +56,21 @@ jobs:
           docker build --file frontend/apps/web/Dockerfile --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY --tag vct-web:ci .
       - name: Verify actual sandboxed Chromium with no network
         run: >-
-          docker run --rm --init --network none --cpus 0.5 --memory 1g --shm-size 256m
+          docker run --rm --init --network none --cpus 0.5 --memory 1g --memory-swap 1g --shm-size 256m
           --security-opt seccomp=infra/browser-seccomp.json
           --env VCT_TEST_BROWSER=true vct-backend:ci
-          python -m pytest backend/tests/test_browser_fallback.py -q -ra -p no:cacheprovider
+          python -m pytest backend/tests/test_browser_fallback.py backend/tests/test_browser_supervision.py
+          -k 'not kernel_oom' -q -ra -p no:cacheprovider
+      - name: Observe allocation failure in a disposable shared cgroup
+        run: >-
+          docker run --rm --init --network none --cpus 0.5 --memory 1g --memory-swap 1g --shm-size 256m
+          --security-opt seccomp=infra/browser-seccomp.json
+          --env VCT_TEST_BROWSER=true --env VCT_TEST_BROWSER_OOM=true vct-backend:ci
+          timeout 60 python -m pytest backend/tests/test_browser_supervision.py
+          -k kernel_oom -q -s -ra -p no:cacheprovider
       - name: Verify Chromium queue ownership and immutable provenance in PostgreSQL
         run: >-
-          docker run --rm --init --network host --cpus 0.5 --memory 1g --shm-size 256m
+          docker run --rm --init --network host --cpus 0.5 --memory 1g --memory-swap 1g --shm-size 256m
           --security-opt seccomp=infra/browser-seccomp.json
           --env VCT_TEST_BROWSER=true
           --env VCT_TEST_DATABASE_URL=postgresql://vct_ci:vct_ci@127.0.0.1:5432/vct_ci
diff --git a/_bmad-output/implementation-artifacts/deferred-work.md b/_bmad-output/implementation-artifacts/deferred-work.md
index 3712c56..6854761 100644
--- a/_bmad-output/implementation-artifacts/deferred-work.md
+++ b/_bmad-output/implementation-artifacts/deferred-work.md
@@ -47,8 +47,8 @@
   summary: Run GitHub CI and an Azure dev smoke check of a queued live 1688 snapshot after a push.
   evidence: The supplied URL returns an anti-bot challenge, so the adapter correctly records BLOCKED without a snapshot; an accessible public URL is needed to verify the deployed success path.
 - source_plan: `_bmad-output/implementation-artifacts/plan-1688-saved-page-import.md`
-  summary: Build a user-invoked 1688 browser extension capture that sends only selected rendered evidence and merges it into owner-scoped snapshots.
-  evidence: The agreed delivery order starts with saved-page import; browser capture is independently shippable and reuses the import provenance contract.
+  summary: RESOLVED — user-invoked 1688 extension capture and owner-scoped merge were implemented.
+  evidence: Superseded by the completed epic-extraction story 2.6 and plan-1688-browser-extension-capture.md, with the earlier accepted 25% live capture. Current-release network/result-opening and Taobao live shop acceptance remain separate under retrospective A5 / ticket 2.13; resolving construction does not claim those checks passed.
 - source_plan: `_bmad-output/implementation-artifacts/plan-1688-saved-page-import.md`
   summary: Assess 1688 Open Platform API eligibility and field coverage before choosing an official integration.
   evidence: API access and available product, supplier, and review fields require verification from the developer portal and do not block the saved-page import.
@@ -99,3 +99,51 @@
 - source_plan: `C:/Users/eidel/Desktop/VCT Connect/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-refactor-sweep-plan.md`
   summary: Recognize zero percentage opacity when excluding invisible selected evidence.
   evidence: Story 2.8 review E7 reproduced opacity:0% text surviving static pruning; the unchanged stylesheet regex handles numeric zero only.
+
+## Extraction follow-up routing — 2026-10-03
+
+The historical entries above remain their original evidence. The user approved retrospective A1–A6; current execution is consolidated in `initiative-vct-connect-year-one/epic-extraction/tickets.toml` and `retrospective-action-execution.md`:
+
+- Five visibility concerns from the refactor baseline → **2.9 / A1**. Only the correction's regression and adapter/browser evidence can resolve them.
+- Decoded response allocation boundary → **2.10 / A2**. Observe allocation before rejection, including cumulative chunks.
+- Forced runner death, independently bounded cleanup and DOM allocation failure hypotheses → **2.12 / A4**. Qualification precedes activation; these are not three presumed defects.
+- Compatible deployed sandbox runtime → **2.11 / A3**, after 2.12. Current false flag remains; `browser-runtime-decision.md` contains the prepared scope/runtime alternatives.
+- Latest-release selected wire payload, popup recovery/result opening and live Taobao shop capture → **2.13 / A5**. `extension-acceptance-checklist.md` records the exact session-dependent journey. Prior item/import acceptance remains valid historical evidence.
+- Cross-baseline defect and exact-environment acceptance audit → **2.14 / A6**, applied in `extraction-completion-gate.md`. Ticket labels alone never close required evidence gaps.
+
+The earlier extension-construction item is explicitly resolved above by its implementation evidence. Other source accessibility, coverage expansion and platform API eligibility concerns remain separate; this consolidation does not invent their completion.
+
+## Extraction review follow-ups — first-instance deferrals, 2026-10-04
+
+These entries process the ten held first-instance review deferrals once. Later carried verdicts do not append them again. Ticket 2.15 owns the remaining static/consumer boundaries; 2.12 retains access-lifecycle and memory/restart qualification; 2.13 retains representative capture/loading/field-coverage observations; 2.16 records the existing official-API assessment separately. None is resolved by a built label or a declared unsupported input.
+
+- source_plan: `_bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md`
+  summary: Qualify mixed supported/pseudo selector-list behavior under ticket 2.15.
+  evidence: Original B2 independently compared baseline and candidate: both leave a wall visible when a mixed selector rule is discarded; this predates the correction and needs an explicit supported-input decision and consumer evidence.
+- source_plan: `_bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md`
+  summary: Qualify Unicode and escaped CSS identifiers under ticket 2.15.
+  evidence: Original B3 found the ASCII selector boundary in both baseline and candidate; Unicode/escape hiding is ignored and requires separate selector and source-classification qualification.
+- source_plan: `_bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md`
+  summary: Observe transient access walls revealed only by visibility-attribute changes under ticket 2.12.
+  evidence: Original B7 identifies the unchanged observer's missing attribute subscription; actual reveal/hide transitions and their observation cost must be qualified before this lifecycle path is accepted.
+- source_plan: `_bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md`
+  summary: Establish bounded profile reclamation across worker death/restart under ticket 2.12.
+  evidence: Original B9 and the actual outer-worker death gate leave an interrupted profile; the production cleanup slot exists only in memory and the test's independent deletion does not establish restart reclamation.
+- source_plan: `_bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md`
+  summary: Finish native browser allocation and durable recovery qualification under ticket 2.12.
+  evidence: Original B10's synthetic allocator bypasses normal collection/encoding/reparse. Parent later observed real UTF-8 MemoryError with caller HTTP preservation and a separate durable kernel-OOM/next-browser completion; isolated serialization, reparsing, durable native-fault completion and permanent broader probe registration remain separate open evidence.
+- source_plan: `_bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md`
+  summary: Qualify line/block-separated access phrases at static and browser consumers under ticket 2.12.
+  evidence: Original E4 found the same missing BR-separated literal phrase classification in baseline and candidate; normalization/layout separation needs independent current-latch and selected-status checks.
+- source_plan: `_bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md`
+  summary: Bound or explicitly qualify static CSS matching work under ticket 2.15.
+  evidence: R2-B1 measured multiplicative rule/node work in both baseline and candidate (800 broad rules and 1,000 nodes); neither has a work guard and parsing executes before a subsequent fetch deadline check.
+- source_plan: `_bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md`
+  summary: Settle ARIA-hidden and HTML-hidden rendering/evidence conventions under ticket 2.15.
+  evidence: R2-B2 compared both versions: aria-hidden text and hidden attributes overridden by display:block are unconditionally suppressed; this is an existing convention requiring a documented consumer decision.
+- source_plan: `_bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md`
+  summary: Qualify CSS all-shorthand visibility rollback under ticket 2.15.
+  evidence: R2-B3 compared display:none;all:initial in both versions and found the same suppression; the shorthand boundary predates the change and needs independent rollback/priority evidence.
+- source_plan: `_bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md`
+  summary: Qualify restored visible product links beneath hidden structural shelves under ticket 2.15.
+  evidence: R2-B6's Taobao fixture produces no products in both baseline and candidate because shelf discovery excludes the inactive structural container before selecting restored visible descendants.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md
index 768c8a5..4530a5a 100644
--- a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md
@@ -39,6 +39,12 @@ Owns platform adapters, extraction, normalization, and snapshot provenance. Anal
 
 ## Notes
 
+- Decision: 2026-10-04 - A6 records surviving static-boundary concerns in planned 2.15 and the prior official-API assessment in planned 2.16; these are inventory ownership records, not implementation or acceptance decisions. The completed historical 2.8 sweep remains intact and 2.14 is the current remediation set's completion audit, so no second sweep is inserted into this approved action set. Any future implementation/refactor scope is refined before execution; API assessment never substitutes for the retained deployed-browser criterion.
+
+- Decision: 2026-10-04 - the user retained deployed browser enrichment as required and left full epic acceptance pending. No A3 scope waiver is accepted; compatible-host exact-image deployed gain/preservation remains an activation and acceptance gate.
+- Decision: 2026-10-03 - the user authorized applying retrospective A1-A6 and proceeding with their action items. Track them as 2.9, 2.10, 2.11, 2.12, 2.13 and 2.14 respectively (A4 maps to 2.12 before A3 runtime qualification at 2.11). The completed 2.8 refactor remains historical; the added entries are remediation and acceptance follow-ups, and 2.14 supplies their completion gate rather than another refactor sweep.
+- Decision: 2026-10-03 - implement confirmed defects and qualification evidence before any browser activation. Existing source-session and deployment prerequisites remain explicit; this instruction does not claim that an unavailable manual check has passed.
+
 - Assumption: 1688 is the first live platform, following section 25.
 - Open question: agree permitted media capture and platform terms before production media collection.
 - Open question: field optionality and completeness calculation need representative samples; do not treat an absent field as a zero-risk signal.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/tickets.toml b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/tickets.toml
index 4c83c32..9411123 100644
--- a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/tickets.toml
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/tickets.toml
@@ -89,3 +89,105 @@ covers = ["R4"]
 after = [2, 3, 4, 5, 6, 7]
 hitl = false
 risk = "low"
+
+[[entry]]
+id = 9
+type = "bug"
+title = "Classify access walls using effective screen visibility"
+description = "Correct the five confirmed shared visibility defects so visible access walls are classified and invisible text does not create a false barrier."
+verify = "All five retrospective visibility reproductions and valid three-platform layouts produce the expected access statuses and evidence boundaries."
+covers = ["R4"]
+after = [8]
+hitl = false
+risk = "medium"
+severity = "P2"
+refine = true
+
+[[entry]]
+id = 10
+type = "bug"
+title = "Bound decoded public response memory before allocation"
+description = "Enforce the public response byte budget during decompression while retaining finite retries, explicit failure statuses and decoded evidence provenance."
+verify = "Compressed-response limit and valid response cases execute through each adapter without oversized decoded allocations or inappropriate snapshots."
+covers = ["R4"]
+after = [8]
+hitl = false
+risk = "medium"
+severity = "P2"
+refine = true
+
+[[entry]]
+id = 12
+type = "story"
+title = "Qualify browser process cleanup and memory failure boundaries"
+description = "Exercise abrupt runner death, slow cleanup and allocation failure under the existing sandbox limits and correct any demonstrated loss of cleanup or preserved HTTP evidence."
+verify = "Actual container fault probes report descendant cleanup, bounded termination, worker survival and preserved HTTP evidence with no skipped covering case."
+covers = ["R4"]
+after = [9, 10]
+hitl = false
+risk = "high"
+unknown = "The three runtime failure hypotheses require measured qualification before activation."
+
+[[entry]]
+id = 11
+type = "story"
+title = "Resolve deployed browser runtime availability and acceptance scope"
+description = "Qualify a compatible supervised Chromium runtime or record an explicit delivery-scope decision retaining disabled fallback until the measured runtime prerequisites hold."
+verify = "The runtime decision identifies the exact supported environment, required qualification evidence and deployment activation gate without relaxing sandbox controls."
+covers = ["R4"]
+after = [12]
+hitl = true
+risk = "high"
+unknown = "Cloud deployment or a paid runtime change needs a concrete release decision after investigation."
+
+[[entry]]
+id = 13
+type = "story"
+title = "Verify signed-in extension payload and merged results"
+description = "Complete latest-release selected-only wire payload, owner-scoped merge, result-opening and live Taobao shop checks using an accessible source session."
+verify = "Recorded browser/network observations and persisted result metadata demonstrate the signed-in journey without platform credentials or duplicate evidence."
+covers = ["R4"]
+after = [9, 10]
+hitl = true
+risk = "high"
+unknown = "An authenticated accessible shop page and browser session are required for live shop acceptance."
+
+[[entry]]
+id = 14
+type = "story"
+title = "Enforce evidence-based extraction completion gates"
+description = "Apply an epic completion checklist that reconciles surviving defects, deployed capability, resource boundaries and superseded follow-ups with their source evidence."
+verify = "The extraction gate reports each criterion and every follow-up honestly, rejects unresolved blockers and distinguishes a declared deferral from a completed runtime or manual check."
+covers = ["R4"]
+after = [9, 10]
+hitl = false
+risk = "medium"
+
+[[entry]]
+id = 15
+type = "story"
+title = "Qualify remaining static visibility and evidence boundaries"
+description = "Use the qualified shared extraction boundary to settle the recorded selector, Unicode, shorthand, hidden-attribute, structural-shelf and CSS-work concerns with distinct consumer evidence and explicit supported-input boundaries."
+verify = "Each recorded concern has an independent reproduction, a justified correction or recorded boundary, selected normalized/raw evidence and hashes, and a finite observed adversarial work outcome without treating unsupported visibility as reassuring."
+covers = ["R4"]
+after = [12]
+hitl = false
+risk = "medium"
+refine = true
+unknown = "Selector breadth, hidden-attribute interpretation and the parser work policy require refinement; this entry records ownership and does not authorize broad CSS support or claim these concerns resolved."
+references = ["parent - _bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md, R4", "review - _bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md, B2/B3 and R2-B1/B2/B3/B6", "inventory - _bmad-output/implementation-artifacts/deferred-work.md, extraction review follow-ups"]
+notes = ["Decision: Recorded as a planned A6 inventory follow-up; implementation is not part of the six current actions.", "Open question: Refine the recorded boundaries and size the implementation before starting; the stable 2.12 compiler/qualification handoff supplies its actual-browser baseline."]
+
+[[entry]]
+id = 16
+type = "story"
+title = "Assess 1688 official API eligibility and permitted field coverage"
+description = "After the representative extension acceptance/coverage record identifies evidence gaps, a person supplies permitted developer-portal access so official 1688 API eligibility and documented field coverage can be assessed as a separate future integration decision."
+verify = "Record current official eligibility, permitted fields and unresolved access requirements with primary sources, compare them with the 2.13 evidence gaps, and state a supported decision without claiming an API implementation or browser-scope waiver."
+covers = ["R4"]
+after = [13]
+hitl = true
+risk = "medium"
+unknown = "Developer-portal access and API entitlement are unknown; any signup, paid access or integration needs a separate concrete decision."
+references = ["parent - _bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md, R4", "source - _bmad-output/implementation-artifacts/plan-1688-saved-page-import.md, official API follow-up", "coverage - _bmad-output/initiative-vct-connect-year-one/epic-extraction/extension-acceptance-checklist.md, representative selected fields"]
+notes = ["Decision: Recorded as a planned A6 inventory follow-up; it does not replace the retained deployed-browser requirement."]
diff --git a/backend/app/extraction/alibaba.py b/backend/app/extraction/alibaba.py
index 8142b18..6966377 100644
--- a/backend/app/extraction/alibaba.py
+++ b/backend/app/extraction/alibaba.py
@@ -211,7 +211,8 @@ def _access(html, *, has_public_evidence=False):
     markers = ('captcha', 'verify you are human', 'security verification', 'access denied', '安全验证', '滑动验证')
     if challenge or any(marker in title for marker in markers) or not has_public_evidence and any(marker in visible for marker in markers):
         return 'BLOCKED', 'ACCESS_CHALLENGE'
-    if _login_page(tree, has_public_evidence=has_public_evidence) or not has_public_evidence and tree.css_first('form input[type="password"]') is not None:
+    if _login_page(tree, has_public_evidence=has_public_evidence) or not has_public_evidence and any(
+            _active(node) for node in tree.css('form input[type="password"]')):
         return 'AUTH_REQUIRED', 'LOGIN_REQUIRED'
     return None
 
diff --git a/backend/app/extraction/browser.py b/backend/app/extraction/browser.py
index 7f53584..abfb63d 100644
--- a/backend/app/extraction/browser.py
+++ b/backend/app/extraction/browser.py
@@ -10,11 +10,14 @@ import logging
 import os
 from pathlib import Path
 import re
+import selectors
 import signal
+import socket
 import subprocess
 import sys
-import tempfile
+import threading
 import time
+from uuid import uuid4
 
 from .contracts import EVIDENCE_FIELDS, evidence_present
 
@@ -126,88 +129,265 @@ def _environment(directory):
     return env
 
 
-def _kill_tree(process):
-    # Playwright's driver may put Chromium into a different process group.
-    # Freeze the child and every descendant before killing; pidfds bind signals
-    # to those processes even if a numeric PID is subsequently reused.
-    handles = {}
-    roots = {process.pid}
-    try:
-        for _ in range(3):
-            parents = {}
-            for path in Path("/proc").iterdir():
-                if path.name.isdigit():
+_attempt_lock = threading.Lock()
+_pending_cleanup = None
+CONTROL_BYTES = 512
+CLEANUP_RESERVE = .5
+
+
+def _bootstrap_command(control_fd, directory):
+    # Execute the stdlib-only file directly. Importing the extraction package
+    # would load every HTTP adapter into a supposedly small trusted helper.
+    return [sys.executable, str(Path(__file__).with_name("browser_supervisor.py")), str(control_fd), directory]
+
+
+def _cleanup_command(directory):
+    return [sys.executable, str(Path(__file__).with_name("browser_supervisor.py")), "--cleanup", directory]
+
+
+def _spawn(command, directory, **kwargs):
+    return subprocess.Popen(command, cwd=Path(__file__).resolve().parents[3],
+                            env=_environment(directory), stderr=subprocess.DEVNULL,
+                            start_new_session=True, **kwargs)
+
+
+def _signal(handle):
+    if handle is not None:
+        try:
+            signal.pidfd_send_signal(handle, signal.SIGKILL)
+            return True
+        except OSError:
+            # Control closure and bootstrap death independently terminate init.
+            pass
+    return False
+
+
+def _drain_cleanup(deadline):
+    """One retained cleanup slot; never accumulate helpers or stale profiles.
+
+    Filesystem operations run in a disposable child. A stuck helper prevents
+    new attempts until it exits and the known directory is successfully deleted.
+    No worker-side filesystem walk or unbounded process wait is permitted.
+    """
+    global _pending_cleanup
+    if _pending_cleanup is None:
+        return True
+    pending = _pending_cleanup
+    bootstrap = pending["bootstrap"]
+    if bootstrap is not None and bootstrap.poll() is None:
+        return False
+    helper = pending["helper"]
+    if helper is not None and pending.get("stopping") and helper.poll() is None:
+        try:
+            helper.wait(timeout=max(0, deadline - time.monotonic()))
+        except subprocess.TimeoutExpired:
+            return False
+    if helper is not None and helper.poll() is not None:
+        if helper.returncode == 0:
+            _pending_cleanup = None
+            return True
+        pending["helper"] = helper = None
+        pending["stopping"] = False
+    if helper is None and time.monotonic() < deadline:
+        try:
+            helper = _spawn(_cleanup_command(pending["directory"]), pending["directory"],
+                            stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
+            pending["helper"] = helper
+        except OSError:
+            return False
+    if helper is not None:
+        try:
+            helper.wait(timeout=max(0, deadline - time.monotonic()))
+        except subprocess.TimeoutExpired:
+            try:
+                helper.kill()
+            except OSError:
+                pass
+            pending["stopping"] = True
+            return False
+        if helper.returncode == 0:
+            _pending_cleanup = None
+            return True
+    return False
+
+
+def _receive(process, control, request, cutoff, handles):
+    """Nonblocking bounded receipt, including the ownership handshake."""
+    output = bytearray()
+    owner = ready = acknowledged = eof = False
+    offset = 0
+    with selectors.DefaultSelector() as poller:
+        control.setblocking(False)
+        os.set_blocking(process.stdin.fileno(), False)
+        os.set_blocking(process.stdout.fileno(), False)
+        poller.register(control, selectors.EVENT_READ, "control")
+        poller.register(process.stdout, selectors.EVENT_READ, "output")
+        while time.monotonic() < cutoff:
+            for key, _ in poller.select(max(0, min(.05, cutoff - time.monotonic()))):
+                if key.data == "control":
+                    raw = control.recv(CONTROL_BYTES + 1)
+                    if not raw:
+                        poller.unregister(control)
+                        if not acknowledged:
+                            return {"code": "RUNTIME_UNAVAILABLE"}
+                        continue
+                    if len(raw) > CONTROL_BYTES:
+                        return {"code": "RUNTIME_UNAVAILABLE"}
                     try:
-                        parents[int(path.name)] = int((path / "stat").read_text().rsplit(")", 1)[1].split()[1])
-                    except (OSError, ValueError, IndexError):
-                        pass
-            while True:
-                found = {pid for pid, parent in parents.items() if parent in roots}
-                if found <= roots:
-                    break
-                roots.update(found)
-            for pid in roots - handles.keys():
+                        message = json.loads(raw)
+                    except (ValueError, UnicodeError, RecursionError):
+                        return {"code": "RUNTIME_UNAVAILABLE"}
+                    if not isinstance(message, dict):
+                        return {"code": "RUNTIME_UNAVAILABLE"}
+                    if message.get("kind") == "OWNER" and not owner:
+                        pid = message.get("pid")
+                        if type(pid) is not int or pid <= 1 or pid == process.pid:
+                            return {"code": "RUNTIME_UNAVAILABLE"}
+                        try:
+                            handles["owner"] = os.pidfd_open(pid)
+                            signal.pidfd_send_signal(handles["owner"], 0)
+                        except OSError:
+                            return {"code": "RUNTIME_UNAVAILABLE"}
+                        owner = True
+                    elif message.get("kind") == "READY" and not ready:
+                        if (message.get("pid") != 1 or message.get("uid") != os.geteuid()
+                                or message.get("gid") != os.getegid()):
+                            return {"code": "RUNTIME_UNAVAILABLE"}
+                        ready = True
+                    else:
+                        return {"code": "RUNTIME_UNAVAILABLE"}
+                    if owner and ready and not acknowledged:
+                        try:
+                            control.send(b"ACK")
+                        except OSError:
+                            return {"code": "RUNTIME_UNAVAILABLE"}
+                        acknowledged = True
+                        poller.register(process.stdin, selectors.EVENT_WRITE, "input")
+                elif key.data == "input":
+                    offset += os.write(process.stdin.fileno(), memoryview(request)[offset:offset + 65536])
+                    if offset == len(request):
+                        poller.unregister(process.stdin)
+                        process.stdin.close()
+                else:
+                    # Read only remaining capacity plus one byte. A hostile
+                    # child cannot force communicate() to buffer its full output.
+                    chunk = os.read(process.stdout.fileno(), min(65536, MAX_BYTES + 1 - len(output)))
+                    if not chunk:
+                        poller.unregister(process.stdout)
+                        eof = True
+                    else:
+                        output.extend(chunk)
+                        if len(output) > MAX_BYTES:
+                            return {"code": "OUTPUT_LIMIT"}
+            if process.poll() is not None and eof:
+                if not acknowledged:
+                    return {"code": "RUNTIME_UNAVAILABLE"}
+                if process.returncode != 0:
+                    return {"code": "RUNTIME_FAILED"}
                 try:
-                    handle = os.pidfd_open(pid)
-                    signal.pidfd_send_signal(handle, signal.SIGSTOP)
-                    handles[pid] = handle
-                except ProcessLookupError:
+                    result = json.loads(output)
+                    if (isinstance(result, dict) and isinstance(result.get("code"), str)
+                            and result["code"] in CODES):
+                        return result
+                except (ValueError, UnicodeError, RecursionError):
                     pass
-        for handle in handles.values():
-            try:
-                signal.pidfd_send_signal(handle, signal.SIGKILL)
-            except ProcessLookupError:
-                pass
-    finally:
-        for handle in handles.values():
-            os.close(handle)
-    try:
-        os.killpg(process.pid, signal.SIGKILL)
-    except ProcessLookupError:
-        pass
-    process.wait(timeout=.5)
+                return {"code": "INVALID_OUTPUT"}
+    return {"code": "DEADLINE" if acknowledged else "RUNTIME_UNAVAILABLE"}
 
 
 def render_cached(html, source_url, platform, analysis_mode, csp):
-    # Linux is the deployment runtime. Without a supervised process group on
-    # another OS, decline the attempt rather than leave browser descendants.
-    if (sys.platform != "linux" or os.geteuid() == 0 or not hasattr(os, "pidfd_open")
-            or not hasattr(signal, "pidfd_send_signal")):
+    global _pending_cleanup
+    deadline = time.monotonic() + BUDGET_SECONDS
+    if (sys.platform != "linux" or os.geteuid() == 0 or os.getegid() == 0
+            or not hasattr(os, "pidfd_open") or not hasattr(signal, "pidfd_send_signal")):
+        return {"code": "RUNTIME_UNAVAILABLE"}
+    if not _attempt_lock.acquire(blocking=False):
         return {"code": "RUNTIME_UNAVAILABLE"}
+    process = control = child_control = None
+    handles = {"owner": None, "bootstrap": None}
+    directory = None
+    completed = False
+    result = {"code": "RUNTIME_UNAVAILABLE"}
     try:
-        handle = os.pidfd_open(os.getpid())
+        # Verify prerequisites before creating any helper. This also avoids
+        # relying on a bootstrap pidfd acquired after a denied pidfd syscall.
+        prerequisite = os.pidfd_open(os.getpid())
         try:
-            signal.pidfd_send_signal(handle, 0)
+            signal.pidfd_send_signal(prerequisite, 0)
         finally:
-            os.close(handle)
-    except OSError:
-        return {"code": "RUNTIME_UNAVAILABLE"}
-    started = time.monotonic()
-    with tempfile.TemporaryDirectory(prefix="vct-browser-") as directory:
-        process = None
-        try:
-            request = json.dumps(dict(html=html, source_url=source_url, platform=platform,
-                                      analysis_mode=analysis_mode, csp=csp)).encode("utf-8")
-            process = subprocess.Popen([sys.executable, "-m", "backend.app.extraction.browser_runner"],
-                                       cwd=Path(__file__).resolve().parents[3], env=_environment(directory),
-                                       stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
-                                       start_new_session=True)
-            output, _ = process.communicate(request, timeout=max(.01, BUDGET_SECONDS - .5 - (time.monotonic() - started)))
-            if len(output) > MAX_BYTES:
-                return {"code": "OUTPUT_LIMIT"}
-            if process.returncode != 0:
-                return {"code": "RUNTIME_FAILED"}
-            result = json.loads(output)
-            if not isinstance(result, dict) or result.get("code") not in CODES:
-                return {"code": "INVALID_OUTPUT"}
+            os.close(prerequisite)
+        # Recovery spends this attempt's existing budget. Reserving only half a
+        # second here repeatedly kills healthy deletions taking slightly longer.
+        if not _drain_cleanup(deadline - CLEANUP_RESERVE):
             return result
-        except subprocess.TimeoutExpired:
-            return {"code": "DEADLINE"}
-        except (OSError, ValueError, UnicodeError):
-            return {"code": "RUNTIME_FAILED"}
-        finally:
-            if process is not None:
-                _kill_tree(process)
+        if (len(html.encode("utf-8")) > MAX_BYTES or not isinstance(csp, (list, tuple))
+                or sum(len(str(value)) for value in [source_url, platform, analysis_mode, *csp]) > 65536):
+            return {"code": "INPUT_LIMIT"}
+        request = json.dumps(dict(html=html, source_url=source_url, platform=platform,
+                                  analysis_mode=analysis_mode, csp=csp)).encode("utf-8")
+        if len(request) > MAX_BYTES * 6 + 65536:
+            return {"code": "INPUT_LIMIT"}
+        # Naming only; creation/deletion happen outside the threaded worker.
+        directory = f"/tmp/vct-browser-{uuid4().hex}"
+        control, child_control = socket.socketpair(socket.AF_UNIX, socket.SOCK_SEQPACKET)
+        process = _spawn(_bootstrap_command(child_control.fileno(), directory), directory,
+                         stdin=subprocess.PIPE, stdout=subprocess.PIPE,
+                         pass_fds=(child_control.fileno(),))
+        child_control.close()
+        child_control = None
+        handles["bootstrap"] = os.pidfd_open(process.pid)
+        signal.pidfd_send_signal(handles["bootstrap"], 0)
+        result = _receive(process, control, request, deadline - CLEANUP_RESERVE, handles)
+        completed = process.poll() == 0  # Namespace exit AND profile deletion.
+        return result
+    except (OSError, ValueError, UnicodeError, RecursionError, MemoryError):
+        return {"code": "RUNTIME_FAILED" if handles["owner"] is not None else "RUNTIME_UNAVAILABLE"}
+    finally:
+        # Independent cleanup steps: one failed signal cannot skip the others.
+        for channel in (control, child_control):
+            if channel is not None:
+                try:
+                    channel.close()
+                except OSError:
+                    pass
+        if not completed:
+            # Init death kills the namespace. Keep its warm bootstrap alive to
+            # reap init and delete the profile during this same deadline.
+            signalled = _signal(handles["owner"])
+            if signalled and process is not None:
+                try:
+                    process.wait(timeout=max(0, deadline - time.monotonic()))
+                except subprocess.TimeoutExpired:
+                    pass
+                completed = process.poll() == 0
+            if process is not None and process.poll() is None:
+                if not _signal(handles["bootstrap"]):
+                    try:
+                        process.kill()
+                    except OSError:
+                        pass
+        for handle in handles.values():
+            if handle is not None:
+                try:
+                    os.close(handle)
+                except OSError:
+                    pass
+        if process is not None:
+            for stream in (process.stdin, process.stdout):
+                if stream is not None:
+                    try:
+                        stream.close()
+                    except OSError:
+                        pass
+            if not completed:
+                try:
+                    process.wait(timeout=max(0, min(.1, deadline - time.monotonic())))
+                except subprocess.TimeoutExpired:
+                    pass
+        if directory is not None and not completed:
+            _pending_cleanup = {"directory": directory, "bootstrap": process, "helper": None}
+            _drain_cleanup(deadline)
+        _attempt_lock.release()
 
 
 def maybe_render(result, html, page_bytes, *, enabled=False, csp=(), renderer=None):
diff --git a/backend/app/extraction/browser_runner.py b/backend/app/extraction/browser_runner.py
index bcc00d2..63dd1f4 100644
--- a/backend/app/extraction/browser_runner.py
+++ b/backend/app/extraction/browser_runner.py
@@ -8,6 +8,84 @@ from .browser import MAX_BYTES
 
 SETTLE_MILLISECONDS = 750
 
+# Snapshot styles before changing the tree: removing siblings can change selector
+# matches. Visibility-hidden ancestors retain their explicitly visible children.
+# Compile an inert view: source visibility rules cannot recascade after removals.
+# Retain only visibility boundaries, rather than annotating every visible node.
+COLLECT_DOM = r"""function(limit) {
+  // This private authored view precedes every mutation of the live tree. Shallow
+  // native clones preserve selector structure/attributes without copying source
+  // scripts or unrelated text. CSSOM state stays separate from selector-relevant
+  // attributes; UA display defaults do not admit hints.
+  if (document.adoptedStyleSheets.length) return {error:'UNREPRESENTED_STYLESHEET'};
+  for (const sheet of document.styleSheets) {
+    if (sheet.ownerNode?.tagName !== 'STYLE') return {error:'UNREPRESENTED_STYLESHEET'};
+  }
+  const sheets=new Map();
+  try {
+    for (const node of document.querySelectorAll('style')) {
+      const sheet=node.sheet;
+      const rules=sheet ? Array.from(sheet.cssRules) : [];
+      if (rules.some(rule=>rule.type === 3)) return {error:'UNREPRESENTED_STYLESHEET'};
+      sheets.set(node,{css:rules.map(rule=>rule.cssText).join('\n'),
+        media:sheet ? sheet.media.mediaText : '', disabled:!sheet || sheet.disabled});
+    }
+  } catch { return {error:'UNREPRESENTED_STYLESHEET'}; }
+  const root=document.documentElement.cloneNode(false);
+  const pending=[[document.documentElement,root]];
+  while (pending.length) {
+    const [source,copy]=pending.pop();
+    if (source.tagName === 'STYLE') {
+      // Keep STYLE's selector position and attributes, but no raw CSS text:
+      // CSSOM strings containing </style> must never become snapshot markup.
+      continue;
+    }
+    for (const child of source.children) {
+      const clone=child.cloneNode(false);
+      copy.appendChild(clone);
+      pending.push([child,clone]);
+    }
+  }
+  const authored=JSON.stringify({html:root.outerHTML,
+    sheets:Array.from(document.querySelectorAll('style'),node=>{
+      const state=sheets.get(node);
+      return {css:state.css,media:state.media,disabled:state.disabled};
+    })});
+  const bounded=text=>text.length <= limit && new TextEncoder().encode(text).length <= limit;
+  if (!bounded(authored)) return null;
+  const nodes=Array.from(document.querySelectorAll('*')).map(node => {
+    const style=getComputedStyle(node);
+    return {node, display:style.display, visibility:style.visibility, opacity:style.opacity};
+  });
+  const visibilityMap=new Map(nodes.map(({node,visibility})=>[node,visibility]));
+  // Snapshotting is complete before any selector inputs are changed.
+  for (const {node} of nodes) {
+    node.removeAttribute('style');
+    if (node.tagName === 'STYLE') node.remove();
+  }
+  for (const {node, display, visibility, opacity} of nodes) {
+    if (!node.isConnected || ['HEAD','LINK','META','SCRIPT'].includes(node.tagName)) continue;
+    if(node.hidden || node.getAttribute('aria-hidden') === 'true' ||
+       display === 'none' || Number(opacity) === 0) {
+      // Keep the document scaffolding and original head identity/model inputs.
+      if (node === document.documentElement || node === document.body)
+        node.setAttribute('style','display:none');
+      else node.remove();
+      continue;
+    }
+    if (['hidden','collapse'].includes(visibility)) {
+      for (const child of Array.from(node.childNodes)) {
+        if (child.nodeType === Node.TEXT_NODE) child.remove();
+      }
+    }
+    const parentVisibility=visibilityMap.get(node.parentElement) || 'visible';
+    if (visibility !== parentVisibility)
+      node.setAttribute('style','visibility:'+visibility);
+  }
+  const text=document.documentElement.outerHTML;
+  return bounded(text) ? {dom:text, authored} : null;
+}"""
+
 # Source CSP remains in force; this second policy only further restricts it.
 RESTRICTION = ("default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; "
                "connect-src 'none'; frame-src 'none'; child-src 'none'; worker-src 'none'; "
@@ -16,6 +94,10 @@ RESTRICTION = ("default-src 'none'; script-src 'unsafe-inline'; style-src 'unsaf
 # These wrappers expose no state. Count denials without URLs, source labels or
 # values. The observer latches access walls so a later DOM change cannot hide it.
 GUARD = r"""(() => {
+  const invoke=Reflect.apply;
+  const native=fn=>(receiver,...args)=>invoke(fn,receiver,args);
+  const exec=native(RegExp.prototype.exec);
+  const matches=(pattern,value)=>exec(pattern,value) !== null;
   let denials = 0;
   const report = () => { denials=Math.min(denials+1,2000000); };
   const deny = function() { report(); throw new DOMException('Unavailable', 'SecurityError'); };
@@ -42,19 +124,19 @@ GUARD = r"""(() => {
   for (const key of ['innerHTML','outerHTML']) {
     const descriptor=Object.getOwnPropertyDescriptor(Element.prototype,key);
     lock(Element.prototype,key,{get:descriptor.get,set:function(value) {
-      if(forbidden.test(String(value))) return deny();
+      if(matches(forbidden,String(value))) return deny();
       descriptor.set.call(this,value);
     }});
   }
   const insert=Element.prototype.insertAdjacentHTML;
   lock(Element.prototype,'insertAdjacentHTML',{value:function(position,value) {
-    if(forbidden.test(String(value))) return deny();
+    if(matches(forbidden,String(value))) return deny();
     return insert.call(this,position,value);
   },writable:false});
   for (const key of ['write','writeln']) {
     const original=Document.prototype[key];
     lock(Document.prototype,key,{value:function(...values) {
-      if(values.some(value=>forbidden.test(String(value)))) return deny();
+      if(values.some(value=>matches(forbidden,String(value)))) return deny();
       return original.apply(this,values);
     },writable:false});
   }
@@ -80,11 +162,63 @@ GUARD = r"""(() => {
   let wall = null;
   lock(globalThis,'__vctAccess',{get:()=>wall});
   lock(globalThis,'__vctDenials',{get:()=>denials});
+  const computedStyle=window.getComputedStyle.bind(window);
+  const numeric=Number;
+  const includes=native(Array.prototype.includes);
+  const slice=native(String.prototype.slice);
+  const lowercase=native(String.prototype.toLowerCase);
+  const trim=native(String.prototype.trim);
+  const whitespace=/\s+/g;
+  const normalize=value=>{
+    // Native exec bypasses both Symbol.replace and a replaced regexp exec.
+    whitespace.lastIndex=0;
+    let part, start=0, text='';
+    while ((part=exec(whitespace,value)) !== null) {
+      text+=slice(value,start,part.index)+' ';
+      start=part.index+part[0].length;
+    }
+    return text+slice(value,start);
+  };
+  const cssValue=native(CSSStyleDeclaration.prototype.getPropertyValue);
+  const createWalker=native(Document.prototype.createTreeWalker);
+  const nextText=native(TreeWalker.prototype.nextNode);
+  const parentElement=native(Object.getOwnPropertyDescriptor(Node.prototype,'parentElement').get);
+  const textContent=native(Object.getOwnPropertyDescriptor(Node.prototype,'textContent').get);
+  const tagName=native(Object.getOwnPropertyDescriptor(Element.prototype,'tagName').get);
+  const attribute=native(Element.prototype.getAttribute);
+  const bodyElement=native(Object.getOwnPropertyDescriptor(Document.prototype,'body').get);
+  const titleText=native(Object.getOwnPropertyDescriptor(Document.prototype,'title').get);
+  const visibleBody = () => {
+    const body=bodyElement(document);
+    if (!body) return '';
+    const walker=createWalker(document,body,4);
+    let part, text='';
+    while ((part=nextText(walker)) && text.length < 2000) {
+      let visible=true;
+      const owner=parentElement(part);
+      for (let node=owner;node;node=parentElement(node)) {
+        const style=computedStyle(node);
+        if (includes(['SCRIPT','STYLE','TEMPLATE','NOSCRIPT'],tagName(node)) || attribute(node,'hidden') !== null ||
+            attribute(node,'aria-hidden') === 'true' || cssValue(style,'display') === 'none' ||
+            numeric(cssValue(style,'opacity')) === 0 ||
+            node === owner && includes(['hidden','collapse'],cssValue(style,'visibility'))) {
+          visible=false;break;
+        }
+      }
+      if (visible) {
+        const normalized=normalize(textContent(part));
+        // Collapse across text-node boundaries before spending the budget.
+        const start=text[text.length-1] === ' ' && normalized[0] === ' ' ? 1 : 0;
+        text += slice(normalized,start,start+2000-text.length);
+      }
+    }
+    return lowercase(text);
+  };
   const inspect = () => {
-    const title=(document.title || '').toLowerCase();
-    const body=(document.body?.innerText || '').slice(0,2000).toLowerCase();
-    if (/(captcha|verify you are human|security verification|access denied|滑动验证|安全验证|请输入验证码|访问受限)/.test(title+' '+body)) wall='BLOCKED';
-    else if (/(login required|please log in|please sign in|登录后|请登录)/.test(title+' '+body) || /^(login|sign in|登录|用户登录|会员登录|1688登录)$/.test(title.trim())) wall='AUTH_REQUIRED';
+    const title=lowercase(titleText(document) || '');
+    const body=visibleBody();
+    if (matches(/(captcha|verify you are human|security verification|access denied|滑动验证|安全验证|请输入验证码|访问受限)/,title+' '+body)) wall='BLOCKED';
+    else if (wall !== 'BLOCKED' && (matches(/(login required|please log in|please sign in|登录后|请登录)/,title+' '+body) || matches(/^(login|sign in|登录|用户登录|会员登录|1688登录)$/,trim(title)))) wall='AUTH_REQUIRED';
     if (wall) window.stop();
   };
   new MutationObserver(inspect).observe(document,{childList:true,subtree:true,characterData:true});
@@ -92,9 +226,28 @@ GUARD = r"""(() => {
 })()"""
 
 
-def _reparse(dom, original, request):
+def _collected_views(value):
+    """Validate both private strings before either is parsed or used as evidence."""
+    if value is None:
+        raise OverflowError("Private view capacity")
+    if type(value) is not dict or set(value) != {"dom", "authored"}:
+        raise ValueError("Invalid private collector envelope")
+    encoded = {}
+    for name in ("dom", "authored"):
+        text = value[name]
+        if type(text) is not str or not text:
+            raise ValueError("Invalid private collector view")
+        if len(text) > MAX_BYTES:
+            raise OverflowError("Private view capacity")
+        encoded[name] = text.encode("utf-8")
+        if len(encoded[name]) > MAX_BYTES:
+            raise OverflowError("Private view capacity")
+    return value["dom"], encoded["dom"], value["authored"]
+
+
+def _reparse(dom, original, request, authored):
     from selectolax.parser import HTMLParser
-    from .dom import tree as _tree
+    from .dom import tree as _tree, active as _active
     from .offer1688 import parse_1688_page
     from .taobao import parse_taobao_page
     from .alibaba import parse_alibaba_page
@@ -104,6 +257,47 @@ def _reparse(dom, original, request):
     for node in tree.css("script"):
         node.decompose()
     source = _tree(original)
+    snapshot = json.loads(authored)
+    if type(snapshot) is not dict or set(snapshot) != {'html', 'sheets'} or type(snapshot['html']) is not str or not snapshot['html'] or type(snapshot['sheets']) is not list:
+        raise ValueError('Invalid authored snapshot')
+    current = _tree(snapshot['html'])
+    styles = current.css('style')
+    if len(styles) != len(snapshot['sheets']):
+        raise ValueError('Invalid authored stylesheet count')
+    media, rules = {}, {}
+    for node, state in zip(styles, snapshot['sheets']):
+        if (type(state) is not dict or set(state) != {'css', 'media', 'disabled'}
+                or type(state['css']) is not str or type(state['media']) is not str
+                or type(state['disabled']) is not bool):
+            raise ValueError('Invalid authored stylesheet state')
+        media[node.mem_id] = None if state['disabled'] else state['media']
+        rules[node.mem_id] = state['css']
+    # Private document state, never an author-provided marker or a body selector.
+    current._screen_stylesheet_media = media
+    current._screen_stylesheet_rules = rules
+    # Keep every current hint, in document order, including duplicates and hints
+    # whose ancestors the evidence compiler removed. Resolve activity before
+    # moving hints; carrying their original CSS would recascade body evidence.
+    hints = []
+    for node in current.css('link, meta'):
+        admitted = _active(node)
+        if 'style' in node.attributes:
+            del node.attrs['style']
+        if not admitted:
+            node.attrs['style'] = 'display:none'
+        hints.append(node.html)
+    for node in tree.css('link, meta'):
+        node.decompose()
+    head = tree.css_first('head')
+    if head is None:
+        return {}
+    for node in HTMLParser(''.join(hints)).css('link, meta'):
+        head.insert_child(node)
+    # Only original script text supplies models. Encode inactive source inputs
+    # before moving them out of their original ancestor/stylesheet context.
+    for node in source.css('script'):
+        if not _active(node):
+            node.attrs['style'] = 'display:none'
     scripts = "".join(node.html for node in source.css("script"))
     body = tree.css_first("body")
     if body is None:
@@ -135,7 +329,13 @@ async def render(request):
     consumed = False
     async with async_playwright() as playwright:
         try:
-            browser = await playwright.chromium.launch(headless=True, chromium_sandbox=True, timeout=7000,
+            # A fresh temporary profile starts its initial page in the same
+            # launch operation. Starting a browser, context and page serially
+            # spends the bounded attempt on renderer startup under CPU quotas.
+            # No saved profile/session is supplied; Playwright removes this
+            # temporary profile on close, and the supervisor owns its TMPDIR.
+            context = await playwright.chromium.launch_persistent_context("", headless=True, chromium_sandbox=True, timeout=7000,
+                accept_downloads=False, service_workers="block", offline=True, java_script_enabled=True,
                 proxy={"server": "http://127.0.0.1:9", "bypass": "<-loopback>"},
                 args=["--disable-background-networking", "--disable-component-update", "--disable-domain-reliability",
                       "--disable-sync", "--disable-breakpad", "--no-pings", "--disable-features=MediaRouter",
@@ -143,10 +343,10 @@ async def render(request):
         except (Error, TimeoutError):
             return {"code": "RUNTIME_UNAVAILABLE"}
         try:
-            context = await browser.new_context(accept_downloads=False, service_workers="block", offline=True,
-                                                java_script_enabled=True, storage_state={"cookies": [], "origins": []})
             await context.add_init_script(GUARD)
-            page = await context.new_page()
+            # The initial page is blank. Install the guard and all routes before
+            # the sole cached-source navigation executes any source script.
+            page = context.pages[0]
             async def route_request(route):
                 nonlocal consumed
                 req = route.request
@@ -187,28 +387,26 @@ async def render(request):
                 return {"code": "CONFLICT", "denials": denials}
             # Read at most a bounded document, never globals, errors or console.
             # Native DOM APIs in an isolated world cannot be replaced by source
-            # scripts in the main world. Only the bounded document is returned.
+            # scripts in the main world. Both bounded views stay private here.
             session = await context.new_cdp_session(page)
             frame = (await session.send("Page.getFrameTree"))["frameTree"]["frame"]["id"]
             world = await session.send("Page.createIsolatedWorld", {"frameId": frame, "worldName": "vct-public-dom"})
             collected = await session.send("Runtime.callFunctionOn", {
                 "executionContextId": world["executionContextId"], "returnByValue": True,
-                "arguments": [{"value": MAX_BYTES}], "functionDeclaration": """function(limit) {
-              for (const node of Array.from(document.querySelectorAll('body *'))) {
-                if (['LINK','META'].includes(node.tagName)) continue;
-                const style=getComputedStyle(node);
-                if(node.hidden || node.getAttribute('aria-hidden') === 'true' ||
-                   style.display === 'none' || ['hidden','collapse'].includes(style.visibility) ||
-                   Number(style.opacity) === 0) node.remove();
-              }
-              const text=document.documentElement.outerHTML;
-              return text.length <= limit && new TextEncoder().encode(text).length <= limit ? text : null;
-            }"""})
-            dom = collected["result"].get("value")
-            if dom is None:
+                "arguments": [{"value": MAX_BYTES}], "functionDeclaration": COLLECT_DOM})
+            try:
+                if ("exceptionDetails" in collected or type(collected.get('result')) is not dict
+                        or 'value' not in collected['result']):
+                    raise ValueError("Private collector exception")
+                dom, encoded, authored = _collected_views(collected['result']['value'])
+            except OverflowError:
                 return {"code": "DOM_LIMIT", "denials": denials}
-            encoded = dom.encode("utf-8")
-            outcome = _reparse(dom, html, request)
+            except (ValueError, TypeError, UnicodeError):
+                return {"code": "RUNTIME_FAILED", "denials": denials}
+            try:
+                outcome = _reparse(dom, html, request, authored)
+            except (ValueError, TypeError, UnicodeError):
+                return {"code": "RUNTIME_FAILED", "denials": denials}
             if outcome.get("extraction_status") in {"AUTH_REQUIRED", "BLOCKED"}:
                 return dict(code="ACCESS_WALL", outcome=outcome, denials=denials, dom_bytes=len(encoded))
             if outcome.get("extraction_status") not in {"SUCCESS", "PARTIAL"}:
@@ -216,7 +414,7 @@ async def render(request):
             return dict(code="GAIN", outcome=outcome, rendered_sha256=sha256(encoded).hexdigest(),
                         denials=denials, dom_bytes=len(encoded))
         finally:
-            await browser.close()
+            await context.close()
 
 
 def main():
diff --git a/backend/app/extraction/dom.py b/backend/app/extraction/dom.py
index c3da57f..e11c3f1 100644
--- a/backend/app/extraction/dom.py
+++ b/backend/app/extraction/dom.py
@@ -6,10 +6,15 @@ from html.parser import HTMLParser as SourceParser
 import re
 
 from selectolax.parser import HTMLParser
+import tinycss2
 
 from .evidence import text
 
 
+class _Document(HTMLParser):
+    """Keep resolved visibility with this document, without source attributes."""
+
+
 def tree(html):
     # HTML tree repair can move a head-level noscript's script outside its
     # inactive ancestor. Remove inert source regions before that repair. The
@@ -53,19 +58,14 @@ def tree(html):
     source = ActiveSource()
     source.feed(html)
     source.close()
-    return HTMLParser("".join(source.parts))
+    return _Document("".join(source.parts))
 
 
 def active(node):
-    while node is not None:
-        if node.tag in {"template", "noscript"} or "hidden" in node.attributes or node.attributes.get("aria-hidden") == "true":
-            return False
-        style = re.sub(r"\s+", "", (node.attributes.get("style") or "").lower())
-        if "display:none" in style or "visibility:hidden" in style or "visibility:collapse" in style or re.search(
-                r"(?:^|;)opacity:(?:0+(?:\.0*)?|\.0+)(?:%|!important|%!important)?(?:;|$)", style):
-            return False
-        node = node.parent
-    return True
+    if node is None:
+        return True
+    state = _states(node.parser).get(node.mem_id)
+    return state is not None and not state[0] and state[1] == "visible"
 
 
 def scripts(tree):
@@ -80,40 +80,169 @@ def scripts(tree):
 
 
 def prune_dom(tree):
-    hidden_roots = [node for node in tree.css("[hidden], [aria-hidden], [style]")
-                    if not active(node) and active(node.parent)]
+    if tree.root is None:
+        return
+    states = _states(tree)
+    hidden_roots, hidden_text = [], []
+    for node in tree.root.traverse(include_text=True):
+        if node.tag == "-text":
+            state = states.get(node.parent.mem_id)
+            if state and not state[0] and state[1] != "visible":
+                hidden_text.append(node)
+            continue
+        state = states[node.mem_id]
+        parent = states.get(node.parent.mem_id) if node.parent else None
+        if state[0] and (parent is None or not parent[0]):
+            hidden_roots.append(node)
+    # Visibility hides an element's own text, but a descendant can restore it.
+    # Keep the ancestors/selector structure of those visible descendants.
+    for node in hidden_text:
+        node.decompose()
     for node in hidden_roots:
         node.decompose()
     tree.strip_tags(["script", "style"])
 
 
 def stylesheet_hidden(tree):
-    """Remove identifiable static hiding rules from active inline styles only.
+    """Resolve the supported static screen cascade, without editing source CSS.
 
-    Simple top-level selectors use the existing CSS selector engine. Conditional
-    at-rules and selectors requiring interactive CSS state are not evaluated.
+    Supports top-level type/id/class/attribute selectors and combinators, inline
+    declarations, important priority and simple screen/all style media lists.
+    Conditional at-rules, pseudo selectors, functions and external CSS remain
+    outside this static boundary. CSS tokenization is delegated to tinycss2.
     """
-    for style in tree.css('style'):
-        if not active(style):
+    _states(tree)
+
+
+_SELECTOR_TOKEN = re.compile(r'''\[(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\[\]"'])+\]|[.#][A-Za-z0-9_-]+|[A-Za-z_-][A-Za-z0-9_-]*|\*|\s+|[>+~]''')
+_DISPLAY_VALUES = {
+    "none", "contents", "block", "inline", "inline-block", "flow-root", "flex", "ruby",
+    "inline-flex", "grid", "inline-grid", "table", "inline-table", "table-row",
+    "table-cell", "table-caption", "table-row-group", "table-header-group",
+    "table-footer-group", "table-column", "table-column-group", "list-item",
+    "block flow", "inline flow", "block flow-root", "inline flow-root",
+    "block flex", "inline flex", "block grid", "inline grid",
+    "inline list-item",
+}
+
+
+def _specificity(selector):
+    tokens = _SELECTOR_TOKEN.findall(selector)
+    if "".join(tokens) != selector or not selector.strip():
+        return None
+    return (sum(token.startswith("#") for token in tokens),
+            sum(token.startswith((".", "[")) for token in tokens),
+            sum(bool(re.fullmatch(r"[A-Za-z_-][A-Za-z0-9_-]*", token)) for token in tokens))
+
+
+def _declarations(source):
+    for declaration in tinycss2.parse_declaration_list(source, skip_comments=True, skip_whitespace=True):
+        if declaration.type != "declaration" or declaration.lower_name not in {"display", "visibility", "opacity"}:
+            continue
+        name = declaration.lower_name
+        tokens = [token for token in declaration.value if token.type not in {"whitespace", "comment"}]
+        value = " ".join(token.lower_value for token in tokens if token.type == "ident")
+        if tokens and all(token.type == "ident" for token in tokens):
+            if value not in {"initial", "inherit", "unset", "revert"}:
+                if name == "opacity" or (name == "visibility" and value not in {"hidden", "collapse", "visible"}):
+                    continue
+                if name == "display" and value not in _DISPLAY_VALUES:
+                    continue
+        elif name == "opacity" and len(tokens) == 1 and tokens[0].type in {"number", "percentage"}:
+            value = min(1., max(0., tokens[0].value / (100 if tokens[0].type == "percentage" else 1)))
+        else:
             continue
-        css = re.sub(r'/\*[\s\S]*?\*/', '', style.text())
-        for match in re.finditer(r'([^{}]+)\{([^{}]*)\}', css):
-            prefix = css[:match.start()]
-            if prefix.count('{') != prefix.count('}'):
+        yield name, value, declaration.important
+
+
+def _states(tree):
+    cached = getattr(tree, "_screen_state", None)
+    if cached is not None:
+        return cached
+    if tree.root is None:
+        return {}
+    winners = {}
+    order = 0
+    def apply(node, declarations, specificity, inline=0):
+        selected = winners.setdefault(node.mem_id, {})
+        for name, value, important, position in declarations:
+            priority = (important, inline, *specificity, position)
+            if name not in selected or priority >= selected[name][0]:
+                selected[name] = priority, value
+
+    for style in tree.css("style"):
+        attrs = style.attributes
+        if (attrs.get("type") or "text/css").strip().lower() != "text/css":
+            continue
+        media = getattr(tree, '_screen_stylesheet_media', {}).get(style.mem_id, attrs.get('media') or '')
+        if media is None:
+            continue
+        media = media.strip().lower()
+        if media and not any(part.strip() in {"screen", "all"} for part in media.split(",")):
+            continue
+        source = getattr(tree, '_screen_stylesheet_rules', {}).get(style.mem_id, style.text())
+        for rule in tinycss2.parse_stylesheet(source, skip_comments=True, skip_whitespace=True):
+            if rule.type != "qualified-rule":
+                continue
+            declarations = []
+            for name, value, important in _declarations(rule.content):
+                order += 1
+                declarations.append((name, value, important, order))
+            if not declarations:
                 continue
-            selectors, declarations = match[1].strip(), match[2]
-            if not re.fullmatch(r'''[A-Za-z0-9_.#\-\s,>+~\[\]="'|*]+''', selectors):
+            groups = [[]]
+            for token in rule.prelude:
+                if token.type == "literal" and token.value == ",":
+                    groups.append([])
+                elif token.type != "comment":
+                    groups[-1].append(token)
+            # Reject nested/functional selectors before serialization, including
+            # malformed deep input which cannot be a supported static selector.
+            if any(token.type not in {"ident", "hash", "literal", "whitespace", "[] block"}
+                   or token.type == "[] block" and any(part.type not in {"ident", "literal", "whitespace", "string", "number"} for part in token.content)
+                   for group in groups for token in group):
                 continue
-            properties = dict(re.findall(r'(?:^|;)\s*(display|visibility|opacity)\s*:\s*([^;]+)', declarations.lower()))
-            properties = {key: re.sub(r'\s+|!important', '', value) for key, value in properties.items()}
-            hidden = properties.get('display') == 'none' or properties.get('visibility') in {'hidden', 'collapse'} or re.fullmatch(r'0+(?:\.0*)?|\.0+', properties.get('opacity', ''))
-            if not hidden:
+            selectors = [tinycss2.serialize(group).strip() for group in groups]
+            specificities = [_specificity(selector) for selector in selectors]
+            # An unsupported selector invalidates this rule, rather than giving
+            # its supported siblings an incorrect part of the browser cascade.
+            if any(specificity is None for specificity in specificities):
                 continue
             try:
-                for node in tree.css(selectors):
-                    node.attrs['hidden'] = ''
+                matches = [tree.css(selector) for selector in selectors]
             except ValueError:
                 continue
+            for nodes, specificity in zip(matches, specificities):
+                for node in nodes:
+                    apply(node, declarations, specificity)
+    for node in tree.css("[style]"):
+        declarations = []
+        for name, value, important in _declarations(node.attributes.get("style") or ""):
+            order += 1
+            declarations.append((name, value, important, order))
+        apply(node, declarations, (0, 0, 0), inline=1)
+
+    states = {}
+    for node in tree.root.traverse():
+        parent = states.get(node.parent.mem_id, (False, "visible", "inline", 1.)) if node.parent else (False, "visible", "inline", 1.)
+        specified = winners.get(node.mem_id, {})
+        computed = {}
+        for name, initial, inherited in (("display", "inline", parent[2]), ("visibility", "visible", parent[1]), ("opacity", 1., parent[3])):
+            value = specified.get(name, (None, "unset"))[1]
+            # Only the author origin is supported here. Revert therefore rolls
+            # back to the default/inherited value, not an earlier author rule.
+            if value == "inherit" or value in {"unset", "revert"} and name == "visibility":
+                value = inherited
+            elif value in {"initial", "unset", "revert"}:
+                value = initial
+            computed[name] = value
+        attrs = node.attributes
+        suppressed = (parent[0] or node.tag in {"template", "noscript"} or "hidden" in attrs
+                      or attrs.get("aria-hidden") == "true" or computed["display"] == "none" or computed["opacity"] == 0)
+        states[node.mem_id] = (suppressed, computed["visibility"], computed["display"], computed["opacity"])
+    if isinstance(tree, _Document):
+        tree._screen_state = states
+    return states
 
 
 def login_page(tree: HTMLParser, *, has_public_evidence=False) -> bool:
diff --git a/backend/app/extraction/fetch.py b/backend/app/extraction/fetch.py
index 1ccfa5a..5ca9d72 100644
--- a/backend/app/extraction/fetch.py
+++ b/backend/app/extraction/fetch.py
@@ -3,6 +3,7 @@ import ipaddress
 import socket
 import ssl
 import time
+import zlib
 from http.cookiejar import CookieJar, DefaultCookiePolicy
 from urllib.parse import urljoin, urlsplit
 import certifi
@@ -10,10 +11,113 @@ import httpcore
 import httpx
 
 MAX_HTML_BYTES = 2_000_000
+# A single unretained sentinel distinguishes an exact-cap page from overflow.
+MAX_DECODED_BYTES = MAX_HTML_BYTES + 1
 MAX_REDIRECTS = 3
 FETCH_BUDGET_SECONDS = 25
 RETRY_DELAYS = (0.5, 1.0)
 TRANSIENT_HTTP_STATUSES = {500, 502, 503, 504}
+DECODE_CHUNK_BYTES = 64 * 1024
+# Deflate has no reliable wire marker: raw stored blocks can resemble zlib.
+# Retain at most this much initial wire data until wrapped output is accepted.
+DEFLATE_REPLAY_BYTES = 64 * 1024
+
+
+class PageTooLarge(Exception):
+    """Decoded response exceeds the shared page capacity."""
+
+
+def _bounded_response_bytes(response, *, deadline, clock):
+    """Decode wire bytes with a bounded zlib output buffer before retaining them.
+
+    A single overflow byte distinguishes an exact-cap body from a larger one.
+    It is never retained or passed to a parser. No unbounded decoder flush is
+    used: EOF and checksums must be reached by bounded decompress calls.
+    """
+    encoding = response.headers.get("content-encoding", "identity").strip().lower()
+    if encoding not in {"identity", "gzip", "deflate"}:
+        raise httpx.DecodingError("Unsupported content encoding")
+
+    def check_deadline():
+        if clock() >= deadline:
+            raise httpx.ReadTimeout("Extraction deadline elapsed")
+
+    # HTTPX response constructors and pre-read MockTransport responses already
+    # decoded their content. iter_raw would raise StreamConsumed and decoding
+    # again would corrupt it. Check the existing bytes without copying them.
+    if response.is_stream_consumed:
+        check_deadline()
+        content = response.content
+        if len(content) > MAX_HTML_BYTES:
+            raise PageTooLarge
+        return content
+
+    content = bytearray()
+    decoder = zlib.decompressobj(16 + zlib.MAX_WBITS) if encoding == "gzip" else None
+    replay = bytearray()
+    wrapped_pending = encoding == "deflate"
+    chunks = iter(response.iter_raw())
+    while True:
+        check_deadline()
+        try:
+            chunk = next(chunks)
+        except StopIteration:
+            break
+        check_deadline()
+        if not chunk:
+            continue
+        if encoding == "identity":
+            if len(chunk) > MAX_HTML_BYTES - len(content):
+                raise PageTooLarge
+            content.extend(chunk)
+            continue
+        if encoding == "deflate" and decoder is None:
+            decoder = zlib.decompressobj(zlib.MAX_WBITS)
+        while chunk:
+            check_deadline()
+            if decoder.eof:
+                if encoding != "gzip":
+                    raise httpx.DecodingError("Trailing compressed data")
+                # RFC gzip members concatenate their decoded bytes; all
+                # members spend the same page budget.
+                decoder = zlib.decompressobj(16 + zlib.MAX_WBITS)
+            maximum = min(DECODE_CHUNK_BYTES, MAX_DECODED_BYTES - len(content))
+            remainder = b""
+            if wrapped_pending:
+                # Split before copying so a large transport chunk cannot grow
+                # the replay buffer beyond its independent wire capacity.
+                capacity = DEFLATE_REPLAY_BYTES - len(replay)
+                if capacity == 0:
+                    raise httpx.DecodingError("Deflate format undecided within replay capacity")
+                remainder = chunk[capacity:]
+                chunk = chunk[:capacity]
+                replay.extend(chunk)
+            try:
+                output = decoder.decompress(chunk, maximum)
+            except zlib.error:
+                if not wrapped_pending:
+                    raise
+                # HTTPX-compatible first-decode fallback, including a valid raw
+                # stream with a plausible zlib header. Once any wrapped output
+                # was accepted (or wrapped EOF reached), never retry corruption.
+                decoder = zlib.decompressobj(-zlib.MAX_WBITS)
+                wrapped_pending = False
+                chunk = bytes(replay)
+                replay.clear()
+                output = decoder.decompress(chunk, maximum)
+            check_deadline()
+            if len(output) > MAX_HTML_BYTES - len(content):
+                raise PageTooLarge
+            content.extend(output)
+            if wrapped_pending and (output or decoder.eof):
+                wrapped_pending = False
+                replay.clear()
+            del output
+            chunk = (decoder.unused_data if decoder.eof else decoder.unconsumed_tail) + remainder
+    check_deadline()
+    if encoding != "identity" and (decoder is None or not decoder.eof):
+        raise httpx.DecodingError("Incomplete compressed response")
+    return bytes(content)
 
 
 class UnsafeDestination(OSError):
@@ -160,7 +264,8 @@ def bounded_extract(source_url: str, *, normalize, identity, parse, classify_acc
                               follow_redirects=False, trust_env=False,
                               cookies=None if accept_cookies else CookieJar(policy=_RejectCookies()),
                               timeout=httpx.Timeout(10.0, connect=5.0),
-                              headers={"User-Agent": "VCTConnectPublicEvidence/1.0", "Accept": "text/html"})
+                              headers={"User-Agent": "VCTConnectPublicEvidence/1.0", "Accept": "text/html",
+                                       "Accept-Encoding": "gzip, deflate"})
     if not accept_cookies:
         client.cookies.clear()
         client.cookies.jar.set_policy(_RejectCookies())
@@ -216,36 +321,27 @@ def bounded_extract(source_url: str, *, normalize, identity, parse, classify_acc
                             return outcome("PARSE_FAILED", "NON_HTML")
                         transient = ("PARSE_FAILED", "UPSTREAM_UNAVAILABLE")
                     else:
-                        content = bytearray()
-                        chunks = iter(response.iter_bytes())
-                        while True:
-                            if clock() >= deadline:
-                                return outcome("TIMEOUT", "HTTP_TIMEOUT")
-                            try:
-                                chunk = next(chunks)
-                            except StopIteration:
-                                break
-                            if clock() >= deadline:
-                                return outcome("TIMEOUT", "HTTP_TIMEOUT")
-                            if len(chunk) > MAX_HTML_BYTES - len(content):
-                                return outcome("PARSE_FAILED", "PAGE_TOO_LARGE")
-                            content.extend(chunk)
+                        content = _bounded_response_bytes(response, deadline=deadline, clock=clock)
                         if clock() >= deadline:
                             return outcome("TIMEOUT", "HTTP_TIMEOUT")
-                        html = decode(bytes(content), response) if decode else content.decode(response.encoding or "utf-8", errors="replace")
+                        html = decode(content, response) if decode else content.decode(response.encoding or "utf-8", errors="replace")
                         if is_transient:
                             access = classify_access(html)
                             if access:
                                 return outcome(*access)
                             transient = ("PARSE_FAILED", "UPSTREAM_UNAVAILABLE")
                         else:
-                            result = parse(html, source_url, analysis_mode=analysis_mode, page_bytes=bytes(content))
+                            result = parse(html, source_url, analysis_mode=analysis_mode, page_bytes=content)
                             if clock() >= deadline:
                                 return outcome("TIMEOUT", "HTTP_TIMEOUT")
                             from .browser import maybe_render
-                            return maybe_render(result, html, bytes(content), enabled=browser_fallback,
+                            return maybe_render(result, html, content, enabled=browser_fallback,
                                                 csp=response.headers.get_list("content-security-policy"),
                                                 renderer=browser_renderer)
+            except PageTooLarge:
+                return outcome("PARSE_FAILED", "PAGE_TOO_LARGE")
+            except zlib.error:
+                return outcome("PARSE_FAILED", "HTTP_ERROR")
             except UnsafeDestination:
                 return outcome("BLOCKED", "UNSAFE_DESTINATION")
             except DNSResolutionFailed:
diff --git a/backend/app/extraction/offer1688.py b/backend/app/extraction/offer1688.py
index 8e13778..3deba15 100644
--- a/backend/app/extraction/offer1688.py
+++ b/backend/app/extraction/offer1688.py
@@ -29,7 +29,7 @@ from .evidence import (
     MalformedPage, field as _field, object as _object, string as _string,
     text as _text, validate_json_evidence as _validate_json_evidence,
 )
-from .dom import login_page as _login_page
+from .dom import login_page as _login_page, tree as _tree, prune_dom as _prune_dom
 from .urls import normalize_1688_url, offer_id
 
 EXTRACTOR_VERSION = "1688-http.v1"
@@ -62,9 +62,16 @@ def _embedded_model(tree: HTMLParser) -> dict:
     return {}
 
 
-def _blocked_page(tree: HTMLParser) -> bool:
-    title = (_text(tree.css_first("title")) or "").lower()
-    body = (_text(tree.css_first("body")) or "")[:2000].lower()
+def _visible_page(html):
+    visible = _tree(html)
+    _prune_dom(visible)
+    return visible
+
+
+def _blocked_page(tree: HTMLParser, visible=None) -> bool:
+    visible = _visible_page(tree.html) if visible is None else visible
+    title = (_text(visible.css_first("title")) or "").lower()
+    body = (_text(visible.css_first("body")) or "")[:2000].lower()
     markers = ("captcha", "verify you are human", "security verification", "access denied",
                "滑动验证", "安全验证", "请输入验证码", "访问受限")
     if any(marker in title or marker in body for marker in markers):
@@ -83,7 +90,7 @@ def parse_1688_page(html: str, source_url: str, **kwargs) -> dict:
     try:
         return _parse_1688_page(html, source_url, **kwargs)
     except (MalformedPage, RecursionError) as exc:
-        tree = HTMLParser(html)
+        tree = _visible_page(html)
         visible = _text(tree.css_first(".shop-company-name h1")) or _text(tree.css_first(".title-content h1"))
         if _login_page(tree, has_public_evidence=bool(visible)):
             return {"source_url": source_url, "extraction_status": "AUTH_REQUIRED", "reason": "LOGIN_REQUIRED"}
@@ -102,9 +109,12 @@ def _parse_1688_page(html: str, source_url: str, *, analysis_mode: str = "ACCOUN
     timestamp = (extracted_at or datetime.now(timezone.utc)).astimezone(timezone.utc).isoformat()
     uploaded = extraction_method == "USER_UPLOAD"
     tree = HTMLParser(html)
-    if _blocked_page(tree):
+    # Keep source model/canonical binding on the original tree. Only access text
+    # and selected DOM evidence use the shared static visibility boundary.
+    visible = _visible_page(html)
+    if _blocked_page(tree, visible):
         return {"source_url": source_url, "extraction_status": "BLOCKED", "reason": "ACCESS_CHALLENGE"}
-    if _login_page(tree, has_public_evidence=True):
+    if _login_page(visible, has_public_evidence=True):
         return {"source_url": source_url, "extraction_status": "AUTH_REQUIRED", "reason": "LOGIN_REQUIRED"}
     model = _embedded_model(tree)
     data = _object(_field(model, "result", "data"))
@@ -113,9 +123,9 @@ def _parse_1688_page(html: str, source_url: str, *, analysis_mode: str = "ACCOUN
     rate = _object(title_fields.get("rateInfo"))
     price = _object(_field(data, "mainPrice", "fields", "finalPriceModel", "tradeWithoutPromotion"))
     root = _object(_field(data, "Root", "fields", "dataJson", "offerBaseInfo"))
-    supplier_name = _string(shop.get("authCompanyName")) or _string(shop.get("companyName")) or _text(tree.css_first(".shop-company-name h1"))
-    offer_title = _string(title_fields.get("title")) or _text(tree.css_first(".title-content h1"))
-    if _login_page(tree, has_public_evidence=bool(supplier_name or offer_title)):
+    supplier_name = _string(shop.get("authCompanyName")) or _string(shop.get("companyName")) or _text(visible.css_first(".shop-company-name h1"))
+    offer_title = _string(title_fields.get("title")) or _text(visible.css_first(".title-content h1"))
+    if _login_page(visible, has_public_evidence=bool(supplier_name or offer_title)):
         return {"source_url": source_url, "extraction_status": "AUTH_REQUIRED", "reason": "LOGIN_REQUIRED"}
     canonical = tree.css_first('link[rel="canonical"]')
     matched_offer = False
@@ -155,7 +165,7 @@ def _parse_1688_page(html: str, source_url: str, *, analysis_mode: str = "ACCOUN
         raise MalformedPage
     reviews = []
     seen_reviews = set()
-    for card in tree.css(".evaluation-item, .review-item, .comment-item, .od-evaluation-item, [data-review-id]"):
+    for card in visible.css(".evaluation-item, .review-item, .comment-item, .od-evaluation-item, [data-review-id]"):
         review_text = _text(card)
         if review_text and review_text not in seen_reviews:
             seen_reviews.add(review_text)
@@ -250,9 +260,10 @@ def extract_1688(source_url: str, *, analysis_mode: str = "ACCOUNT_PUBLIC",
                  clock=time.monotonic, sleep=time.sleep, browser_fallback=False, browser_renderer=None) -> dict:
     def access(html):
         tree = HTMLParser(html)
-        if _blocked_page(tree):
+        visible = _visible_page(html)
+        if _blocked_page(tree, visible):
             return "BLOCKED", "ACCESS_CHALLENGE"
-        if _login_page(tree):
+        if _login_page(visible):
             return "AUTH_REQUIRED", "LOGIN_REQUIRED"
         return None
 
diff --git a/backend/app/extraction/taobao.py b/backend/app/extraction/taobao.py
index 20c8bbb..d9dda55 100644
--- a/backend/app/extraction/taobao.py
+++ b/backend/app/extraction/taobao.py
@@ -269,6 +269,8 @@ def _parse(html, source_url, mode, extracted_at, page_bytes):
         cards = [card for shelf in shelves for card in shelf.css(".shop-item-card")]
         for card in cards:
             for link in card.css("a[href]"):
+                if not _active(link) and not any(_active(child) for child in link.traverse()):
+                    continue
                 href = link.attributes["href"]
                 try:
                     url = normalize_taobao_url("https:" + href if href.startswith("//") else href)
diff --git a/backend/requirements.txt b/backend/requirements.txt
index e4c06d2..b55b767 100644
--- a/backend/requirements.txt
+++ b/backend/requirements.txt
@@ -10,4 +10,5 @@ httpx>=0.28,<0.29
 httpcore>=1,<2
 certifi>=2024,<2028
 selectolax>=0.4,<1
+tinycss2>=1.4,<2
 playwright==1.63.0
diff --git a/backend/tests/test_browser_fallback.py b/backend/tests/test_browser_fallback.py
index 8185399..6552896 100644
--- a/backend/tests/test_browser_fallback.py
+++ b/backend/tests/test_browser_fallback.py
@@ -20,6 +20,13 @@ from backend.app.extraction.contracts import EVIDENCE_FIELDS
 ADAPTERS = {"1688": (extract_1688, parse_1688_page), "TAOBAO": (extract_taobao, parse_taobao_page),
             "ALIBABA": (extract_alibaba, parse_alibaba_page)}
 REAL = pytest.mark.skipif(os.getenv("VCT_TEST_BROWSER") != "true", reason="Actual Chromium checks run explicitly in the nonroot, network-denied image")
+SCREEN_WALL_CASES = [
+    ('<style>.runtime-wall{display:none}.runtime-wall{display:block}</style>', '<p class="runtime-wall">WALL</p>', 'AUTH_REQUIRED'),
+    ('', '<p style="display:none;display:block">WALL</p>', 'AUTH_REQUIRED'),
+    ('', '<div style="visibility:hidden">INVISIBLE_PARENT_SENTINEL<span style="visibility:visible">WALL</span></div>', 'AUTH_REQUIRED'),
+    ('<style media="print">.runtime-wall{display:none}</style>', '<p class="runtime-wall">WALL</p>', 'AUTH_REQUIRED'),
+    ('<style>.runtime-wall{opacity:0%}</style>', '<p class="runtime-wall">WALL</p>', None),
+]
 
 
 def fixture(platform="1688", extra="", *, render=True, delay=0):
@@ -288,6 +295,814 @@ def test_actual_source_csp_and_computed_hidden_dom_preserve_http():
     assert maybe_render(result, hidden, hidden.encode(), enabled=True) is result
 
 
+@REAL
+@pytest.mark.parametrize("platform", ADAPTERS)
+def test_actual_computed_visibility_preserves_restored_descendant_evidence(platform, caplog):
+    selector = {"1688": ".review-item", "TAOBAO": ".shopProductShelfArea--test", "ALIBABA": ".product-review"}[platform]
+    program = """
+      const evidence=document.querySelector(SELECTOR);
+      const parent=document.createElement('section');
+      parent.className='inherited-hidden';
+      evidence.before(parent);parent.appendChild(evidence);
+      parent.appendChild(document.createTextNode('INVISIBLE_PARENT_SENTINEL'));
+      evidence.style.visibility='visible';
+    """.replace('SELECTOR', json.dumps(selector))
+    result, html = extracted(platform, extra=program)
+    html = html.replace('</head>', '<style>@media (min-width:1px){.inherited-hidden{visibility:hidden}}</style></head>')
+    started = time.monotonic()
+    with caplog.at_level(logging.INFO, logger='backend.app.extraction.browser'):
+        selected = maybe_render(result, html, html.encode(), enabled=True)
+    assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER', caplog.text
+    assert 'code=GAIN' in caplog.text
+    assert time.monotonic() - started < 10
+    assert field_count(selected['supplier_data']) > field_count(result['supplier_data'])
+    assert preserves(result['supplier_data'], selected['supplier_data'])
+    assert selected['raw_payload']['html_sha256'] == sha256(html.encode()).hexdigest()
+    assert 'INVISIBLE_PARENT_SENTINEL' not in json.dumps(selected)
+
+
+@REAL
+@pytest.mark.parametrize("platform", ADAPTERS)
+@pytest.mark.parametrize("style", ['opacity:0%', 'display:none', 'visibility:hidden'])
+def test_actual_invisible_access_text_does_not_latch_a_wall(platform, style):
+    letters = json.dumps([ord(char) for char in 'Captcha Please sign in'])
+    program = "document.body.insertAdjacentHTML('afterbegin','<p style=\"' + STYLE + '\">' + LETTERS.map(n=>String.fromCharCode(n)).join('') + '</p>');"
+    result, html = extracted(platform, extra=program.replace('STYLE', json.dumps(style)).replace('LETTERS', letters))
+    selected = maybe_render(result, html, html.encode(), enabled=True)
+    assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER'
+    assert 'Captcha' not in json.dumps(selected)
+
+
+@REAL
+@pytest.mark.parametrize("platform", ADAPTERS)
+@pytest.mark.parametrize("styles,markup,expected", SCREEN_WALL_CASES)
+def test_actual_five_screen_cases_through_wrapper_and_latch(platform, styles, markup, expected, caplog):
+    from backend.app.extraction.browser import access_wall
+    letters = json.dumps([ord(char) for char in ('Please sign in' if expected else 'Captcha Please sign in')])
+    program = "document.body.insertAdjacentHTML('afterbegin', MARKUP.replace('WALL', LETTERS.map(n=>String.fromCharCode(n)).join('')));"
+    result, html = extracted(platform, extra=program.replace('MARKUP', json.dumps(markup)).replace('LETTERS', letters))
+    html = html.replace('</head>', styles + '</head>')
+    assert access_wall(html) is None  # Wall text only exists after execution.
+    with caplog.at_level(logging.INFO, logger='backend.app.extraction.browser'):
+        selected = maybe_render(result, html, html.encode(), enabled=True)
+    if expected:
+        assert selected['extraction_status'] == expected
+        assert 'supplier_data' not in selected and 'raw_payload' not in selected
+        assert 'code=ACCESS_WALL' in caplog.text
+    else:
+        assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER'
+        assert preserves(result['supplier_data'], selected['supplier_data'])
+        assert 'code=GAIN' in caplog.text and 'code=ACCESS_WALL' not in caplog.text
+
+
+@REAL
+@pytest.mark.parametrize("platform", ADAPTERS)
+@pytest.mark.parametrize("styles,markup,expected", SCREEN_WALL_CASES)
+def test_actual_five_screen_cases_through_isolated_collector(platform, styles, markup, expected):
+    import asyncio
+    from backend.app.extraction.browser import access_wall, MAX_BYTES
+    from backend.app.extraction.browser_runner import COLLECT_DOM, _reparse
+    from backend.app.extraction.dom import tree
+    from playwright.async_api import async_playwright
+
+    source, original = fixture(platform, render=False)
+    inert = tree(original)
+    for script in inert.css('script'):
+        script.decompose()
+    wall_text = 'Please sign in' if expected else 'Captcha Please sign in'
+    html = inert.html.replace('</head>', styles + '</head>').replace('<body>', '<body>' + markup.replace('WALL', wall_text))
+    async def collect():
+        async with async_playwright() as playwright:
+            browser = await playwright.chromium.launch(headless=True, chromium_sandbox=True, timeout=7000)
+            try:
+                context = await browser.new_context(offline=True, service_workers='block')
+                await context.route('**/*', lambda route: route.abort())
+                page = await context.new_page()
+                await page.set_content(html)
+                session = await context.new_cdp_session(page)
+                frame = (await session.send('Page.getFrameTree'))['frameTree']['frame']['id']
+                world = await session.send('Page.createIsolatedWorld', {'frameId': frame, 'worldName': 'vct-visibility-test'})
+                result = await session.send('Runtime.callFunctionOn', {
+                    'executionContextId': world['executionContextId'], 'returnByValue': True,
+                    'arguments': [{'value': MAX_BYTES}], 'functionDeclaration': COLLECT_DOM,
+                })
+                return result['result']['value']
+            finally:
+                await browser.close()
+    collected = asyncio.run(collect())
+    assert access_wall(collected['dom']) == expected
+    assert 'INVISIBLE_PARENT_SENTINEL' not in collected['dom']
+    if expected is None:
+        assert 'Please sign in' not in collected['dom']
+    before = ADAPTERS[platform][1](original, source)
+    after = _reparse(collected['dom'], original, {'platform': platform, 'source_url': source, 'analysis_mode': 'ACCOUNT_PUBLIC'}, collected['authored'])
+    # Access precedence belongs to each adapter; whenever it selects evidence,
+    # this collector must preserve its original model and source binding.
+    if after.get('supplier_data'):
+        assert preserves(before['supplier_data'], after['supplier_data'])
+
+
+@REAL
+@pytest.mark.parametrize("platform", ADAPTERS)
+def test_actual_access_latch_resists_visibility_api_tampering(platform):
+    letters = json.dumps([ord(char) for char in 'Captcha'])
+    program = """
+      window.getComputedStyle=()=>({display:'none',visibility:'hidden',opacity:'0'});
+      document.createTreeWalker=()=>({nextNode:()=>null});
+      TreeWalker.prototype.nextNode=()=>null;
+      CSSStyleDeclaration.prototype.getPropertyValue=()=> 'none';
+      document.body.insertAdjacentHTML('afterbegin','<p>'+LETTERS.map(n=>String.fromCharCode(n)).join('')+'</p>');
+    """.replace('LETTERS', letters)
+    result, html = extracted(platform, extra=program)
+    selected = maybe_render(result, html, html.encode(), enabled=True)
+    assert selected['extraction_status'] == 'BLOCKED'
+    assert 'supplier_data' not in selected and 'raw_payload' not in selected
+
+
+@REAL
+@pytest.mark.parametrize('platform', ADAPTERS)
+def test_actual_transient_access_wall_resists_mutable_number(platform):
+    letters = json.dumps([ord(char) for char in 'Captcha'])
+    program = """
+      window.Number=()=>0;
+      const wall=document.createElement('p');
+      wall.textContent=LETTERS.map(n=>String.fromCharCode(n)).join('');
+      document.body.appendChild(wall);
+      setTimeout(()=>wall.remove(),50);
+    """.replace('LETTERS', letters)
+    original, html = extracted(platform, extra=program)
+    selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected['extraction_status'] == 'BLOCKED'
+    assert 'supplier_data' not in selected and 'raw_payload' not in selected
+
+
+@REAL
+@pytest.mark.parametrize('platform', ADAPTERS)
+@pytest.mark.parametrize('fault', ['includes', 'whitespace', 'normalizer', 'split-whitespace',
+                                 'call', 'symbol-replace', 'regexp-test', 'regexp-exec', 'regexp-both'])
+def test_actual_transient_access_wall_survives_mutable_traversal_and_normalized_budget(platform, fault):
+    letters = json.dumps([ord(char) for char in 'Captcha'])
+    program = """
+      FAULT
+      const wall=document.createElement('p');
+      wall.textContent=PREFIX+LETTERS.map(n=>String.fromCharCode(n)).join('');
+      document.body.prepend(wall);
+      setTimeout(()=>wall.remove(),50);
+    """
+    fault_program = {
+        'includes': "const includes=Array.prototype.includes;Array.prototype.includes=function(v,...rest){if(v==='P')return true;return includes.call(this,v,...rest);};",
+        'normalizer': "String.prototype.replace=function(){return '';};String.prototype.slice=function(){return '';};String.prototype.toLowerCase=function(){return '';};",
+        'whitespace': '',
+        'split-whitespace': "for(let i=0;i<2100;i++)document.body.appendChild(document.createTextNode(' '));",
+        'call': "const call=Function.prototype.call;Function.prototype.call=function(...args){if(this.name==='get body')return null;return Reflect.apply(call,this,args);};",
+        'symbol-replace': "RegExp.prototype[Symbol.replace]=function(){return '';};",
+        'regexp-test': "RegExp.prototype.test=function(){return false;};",
+        'regexp-exec': "RegExp.prototype.exec=function(){return null;};",
+        'regexp-both': "RegExp.prototype.test=function(){return false;};RegExp.prototype.exec=function(){return null;};",
+    }[fault]
+    prefix = "''" if fault in {'includes', 'split-whitespace'} else "' '.repeat(5000)"
+    program = program.replace('FAULT', fault_program).replace('PREFIX', prefix).replace('LETTERS', letters)
+    if fault == 'split-whitespace':
+        program = program.replace('document.body.prepend(wall)', 'document.body.appendChild(wall)')
+    original, html = extracted(platform, extra=program)
+    selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected['extraction_status'] == 'BLOCKED'
+    assert selected['reason'] == 'ACCESS_CHALLENGE'
+    assert 'supplier_data' not in selected and 'raw_payload' not in selected
+
+
+@REAL
+@pytest.mark.parametrize('platform', ADAPTERS)
+def test_actual_temporal_captcha_then_login_retains_blocked_precedence(platform):
+    captcha = json.dumps([ord(char) for char in 'Captcha'])
+    login = json.dumps([ord(char) for char in 'Please sign in'])
+    program = """
+      const wall=document.createElement('p');
+      wall.textContent=CAPTCHA.map(n=>String.fromCharCode(n)).join('');
+      document.body.prepend(wall);
+      setTimeout(()=>{wall.textContent=LOGIN.map(n=>String.fromCharCode(n)).join('');},50);
+    """.replace('CAPTCHA', captcha).replace('LOGIN', login)
+    original, html = extracted(platform, extra=program)
+    selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected['extraction_status'] == 'BLOCKED'
+    assert selected['reason'] == 'ACCESS_CHALLENGE'
+    assert 'supplier_data' not in selected and 'raw_payload' not in selected
+
+
+async def collect_isolated(html):
+    from backend.app.extraction.browser import MAX_BYTES
+    from backend.app.extraction.browser_runner import COLLECT_DOM
+    from playwright.async_api import async_playwright
+    async with async_playwright() as playwright:
+        browser = await playwright.chromium.launch(headless=True, chromium_sandbox=True, timeout=7000)
+        try:
+            context = await browser.new_context(offline=True, service_workers='block')
+            await context.route('**/*', lambda route: route.abort())
+            page = await context.new_page()
+            await page.set_content(html)
+            session = await context.new_cdp_session(page)
+            frame = (await session.send('Page.getFrameTree'))['frameTree']['frame']['id']
+            world = await session.send('Page.createIsolatedWorld', {'frameId': frame, 'worldName': 'vct-regression'})
+            result = await session.send('Runtime.callFunctionOn', {
+                'executionContextId': world['executionContextId'], 'returnByValue': True,
+                'arguments': [{'value': MAX_BYTES}], 'functionDeclaration': COLLECT_DOM})
+            assert 'exceptionDetails' not in result, result
+            return result['result'].get('value')
+        finally:
+            await browser.close()
+
+
+def inactive_authoritative_input(kind, placement):
+    attributes = 'class="source-inactive"' + (' style="display:none"' if placement == 'inline' else '')
+    foreign = 'https://www.alibaba.com/product-detail/Other_999999999.html'
+    if kind == 'meta':
+        markup = f'<meta property="og:url" content="{foreign}" {attributes}>'
+    elif kind == 'canonical':
+        markup = f'<link rel="canonical" href="{foreign}" {attributes}>'
+    else:
+        markup = f'<script type="application/ld+json" {attributes}>{{"@type":"Product","sku":"999999999"}}</script>'
+    if placement.startswith('ancestor-'):
+        markup = '<section class="source-inactive"' + (' style="display:none"' if placement == 'ancestor-inline' else '') + '>' + markup + '</section>'
+    styles = '<style>.source-inactive{display:none}</style>' if placement in {'stylesheet', 'ancestor-stylesheet'} else ''
+    return styles + markup
+
+
+INACTIVE_INPUT_CASES = [(kind, placement) for placement in ('inline', 'stylesheet')
+                        for kind in ('meta', 'canonical', 'jsonld')]
+INACTIVE_INPUT_CASES += [('jsonld', 'ancestor-inline'), ('jsonld', 'ancestor-stylesheet')]
+
+
+@pytest.mark.parametrize('kind,placement', INACTIVE_INPUT_CASES)
+def test_reparse_preserves_original_inactive_authoritative_inputs(kind, placement):
+    from backend.app.extraction.browser_runner import _reparse
+    from selectolax.parser import HTMLParser
+    source, original = fixture('ALIBABA')
+    original = original.replace('</head>', inactive_authoritative_input(kind, placement) + '</head>')
+    before = ADAPTERS['ALIBABA'][1](original, source)
+    assert before['extraction_status'] == 'PARTIAL'
+    compiled = HTMLParser(original)
+    # Independent reproduction of the collector's style compilation.
+    for node in compiled.css('[style]'):
+        del node.attrs['style']
+    for node in compiled.css('style'):
+        node.decompose()
+    review = '<div class="product-review"><div class="product-review-list"><div class="r-relative r-whitespace-normal">Useful public review</div></div></div>'
+    compiled.body.insert_child(HTMLParser(review).css_first('.product-review'))
+    after = _reparse(compiled.html, original, dict(platform='ALIBABA', source_url=source, analysis_mode='ACCOUNT_PUBLIC'), authored_snapshot(original))
+    assert after['extraction_status'] == 'PARTIAL'
+    assert preserves(before['supplier_data'], after['supplier_data'])
+    assert after['raw_payload']['public_fields']['jsonld_identity'] == []
+    selected = maybe_render(before, original, original.encode(), enabled=True, renderer=lambda *_: dict(
+        code='GAIN', outcome=after, rendered_sha256=sha256(compiled.html.encode()).hexdigest()))
+    assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER'
+    assert selected['supplier_data']['reviews'] == [{'text': 'Useful public review', 'source_url': source}]
+    assert field_count(selected['supplier_data']) > field_count(before['supplier_data'])
+    assert selected['raw_payload']['html_sha256'] == sha256(original.encode()).hexdigest()
+
+
+@REAL
+@pytest.mark.parametrize('kind,placement', INACTIVE_INPUT_CASES)
+def test_actual_inactive_authoritative_inputs_preserve_gain_and_original_hash(kind, placement):
+    source, html = fixture('ALIBABA')
+    html = html.replace('</head>', inactive_authoritative_input(kind, placement) + '</head>')
+    original = ADAPTERS['ALIBABA'][1](html, source)
+    assert original['extraction_status'] == 'PARTIAL'
+    frozen = deepcopy(original)
+    selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER'
+    assert selected['supplier_data']['reviews'] == [{'text': 'Useful public review', 'source_url': source}]
+    assert preserves(original['supplier_data'], selected['supplier_data'])
+    assert original == frozen
+    assert selected['raw_payload']['public_fields']['jsonld_identity'] == []
+    assert selected['raw_payload']['html_sha256'] == sha256(html.encode()).hexdigest()
+
+
+@pytest.mark.parametrize('change', ['changed', 'introduced', 'duplicate', 'revealed'])
+def test_reparse_checks_changed_or_new_rendered_foreign_identity_hints(change):
+    from backend.app.extraction.browser_runner import _reparse
+    from selectolax.parser import HTMLParser
+    source, original = fixture('ALIBABA', render=False)
+    original = original.replace('</head>', inactive_authoritative_input('meta', 'inline') + '</head>')
+    compiled = HTMLParser(original)
+    node = compiled.css_first('meta[property="og:url"]')
+    if change == 'changed':
+        del node.attrs['style']
+        node.attrs['content'] = 'https://www.alibaba.com/product-detail/Changed_888888888.html'
+    elif change == 'revealed':
+        node.attrs['style'] = 'display:block'
+    else:
+        extra = node.html.replace(' style="display:none"', '') if change == 'duplicate' else '<link rel="canonical" href="https://www.alibaba.com/product-detail/Other_999999999.html">'
+        compiled.head.insert_child(HTMLParser(extra).css_first('link, meta'))
+    after = _reparse(compiled.html, original, dict(platform='ALIBABA', source_url=source, analysis_mode='ACCOUNT_PUBLIC'), authored_snapshot(compiled.html))
+    assert after['extraction_status'] == 'PARSE_FAILED'
+    assert 'supplier_data' not in after and 'raw_payload' not in after
+
+
+METADATA_VISIBILITY = [('display', 'none', 'block'), ('visibility', 'hidden', 'visible'), ('opacity', '0', '1')]
+
+
+def authored_snapshot(html, states=None):
+    from selectolax.parser import HTMLParser
+    structure = HTMLParser(html)
+    sheets = []
+    for index, node in enumerate(structure.css('style')):
+        state = states[index] if states is not None else dict(media=node.attributes.get('media') or '', disabled=False)
+        sheets.append(dict(css=node.text(), **state))
+        while node.child:
+            node.child.decompose()
+    return json.dumps(dict(html=structure.html, sheets=sheets))
+
+
+def compiled_metadata_view(authored):
+    """Independent reproduction of CSS removal, with selected rendered evidence."""
+    from selectolax.parser import HTMLParser
+    compiled = HTMLParser(authored)
+    for node in compiled.css('style'):
+        node.decompose()
+    for node in compiled.css('[style]'):
+        del node.attrs['style']
+    review = '<div class="product-review"><div class="product-review-list"><div class="r-relative r-whitespace-normal">Useful public review</div></div></div>'
+    compiled.body.insert_child(HTMLParser(review).css_first('.product-review'))
+    return compiled.html
+
+
+def assert_metadata_gain(original, source, authored, compiled):
+    from backend.app.extraction.browser_runner import _reparse
+    before = ADAPTERS['ALIBABA'][1](original, source)
+    after = _reparse(compiled, original, dict(platform='ALIBABA', source_url=source, analysis_mode='ACCOUNT_PUBLIC'), authored_snapshot(authored))
+    assert after['extraction_status'] == 'PARTIAL'
+    assert preserves(before['supplier_data'], after['supplier_data'])
+    selected = maybe_render(before, original, original.encode(), enabled=True, renderer=lambda *_: dict(
+        code='GAIN', outcome=after, rendered_sha256=sha256(compiled.encode()).hexdigest()))
+    assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER'
+    assert selected['supplier_data']['supplier_name'] == 'Public supplier'
+    assert selected['supplier_data']['reviews'] == [{'text': 'Useful public review', 'source_url': source}]
+    assert selected['raw_payload']['public_fields']['review_bodies'] == [dict(
+        text='Useful public review', source_url=source, original_length=20, truncated=False)]
+    assert selected['raw_payload']['html_sha256'] == sha256(original.encode()).hexdigest()
+    assert selected['raw_payload']['rendered_html_sha256'] == sha256(compiled.encode()).hexdigest()
+    return selected
+
+
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+@pytest.mark.parametrize('property,hidden,visible', METADATA_VISIBILITY)
+def test_reparse_stylesheet_only_reveal_uses_current_activity_with_stale_negative_control(kind, property, hidden, visible):
+    from backend.app.extraction.browser_runner import _reparse
+    source, original = fixture('ALIBABA')
+    markup = inactive_authoritative_input(kind, 'stylesheet').replace('display:none', property + ':' + hidden)
+    original = original.replace('</head>', markup + '</head>')
+    authored = original.replace(property + ':' + hidden, property + ':' + visible)
+    compiled = compiled_metadata_view(authored)
+    request = dict(platform='ALIBABA', source_url=source, analysis_mode='ACCOUNT_PUBLIC')
+    after = _reparse(compiled, original, request, authored_snapshot(authored))
+    assert after['extraction_status'] == 'PARSE_FAILED'
+    assert 'supplier_data' not in after and 'raw_payload' not in after
+    # Passing stale HTTP activity reproduces the prohibited gain independently.
+    stale = _reparse(compiled, original, request, authored_snapshot(original))
+    assert stale['extraction_status'] == 'PARTIAL'
+    assert stale['supplier_data']['reviews']
+
+
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+@pytest.mark.parametrize('property,hidden,visible', METADATA_VISIBILITY)
+@pytest.mark.parametrize('placement', ['inline', 'stylesheet'])
+def test_reparse_current_hidden_hints_preserve_gain_and_selected_hashes(kind, property, hidden, visible, placement):
+    source, original = fixture('ALIBABA')
+    markup = inactive_authoritative_input(kind, placement).replace('display:none', property + ':' + hidden)
+    authored = original.replace('</head>', markup + '</head>')
+    assert_metadata_gain(original, source, authored, compiled_metadata_view(authored))
+
+
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+@pytest.mark.parametrize('state', ['default', 'active-inline', 'active-stylesheet', 'hidden-inline', 'hidden-stylesheet'])
+def test_reparse_unchanged_head_hint_activity_and_default_admission(kind, state):
+    source, original = fixture('ALIBABA')
+    placement = 'stylesheet' if state.endswith('stylesheet') else 'inline'
+    markup = inactive_authoritative_input(kind, placement)
+    if state == 'default':
+        markup = markup.replace(' style="display:none"', '')
+    elif state.startswith('active'):
+        markup = markup.replace('display:none', 'display:block')
+    if not state.startswith('hidden'):
+        markup = markup.replace('https://www.alibaba.com/product-detail/Other_999999999.html', source)
+    original = original.replace('</head>', markup + '</head>')
+    assert_metadata_gain(original, source, original, compiled_metadata_view(original))
+
+
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+@pytest.mark.parametrize('active_duplicate', [False, True])
+def test_reparse_duplicate_hints_do_not_consume_stale_or_pruned_activity(kind, active_duplicate):
+    from backend.app.extraction.browser_runner import _reparse
+    from selectolax.parser import HTMLParser
+    source, original = fixture('ALIBABA')
+    hint = inactive_authoritative_input(kind, 'inline').replace(' style="display:none"', '')
+    # Both copies have identical attributes; only their ancestor state differs.
+    authored = original.replace('</body>', '<section style="display:none">' + hint + '</section>'
+        + '<section style="display:' + ('block' if active_duplicate else 'none') + '">' + hint + '</section></body>')
+    compiled = HTMLParser(compiled_metadata_view(authored))
+    for node in compiled.css('section'):
+        node.decompose()  # Evidence pruning cannot erase current identity checks.
+    if active_duplicate:
+        after = _reparse(compiled.html, original, dict(platform='ALIBABA', source_url=source, analysis_mode='ACCOUNT_PUBLIC'), authored_snapshot(authored))
+        assert after['extraction_status'] == 'PARSE_FAILED'
+        assert 'supplier_data' not in after and 'raw_payload' not in after
+    else:
+        assert_metadata_gain(original, source, authored, compiled.html)
+
+
+@pytest.mark.parametrize('value,error', [
+    (None, OverflowError), ('<html></html>', ValueError), ({}, ValueError),
+    ({'dom': '<html></html>'}, ValueError),
+    ({'dom': '<html></html>', 'authored': None}, ValueError),
+    ({'dom': [], 'authored': '<html></html>'}, ValueError),
+    ({'dom': '', 'authored': '<html></html>'}, ValueError),
+    ({'dom': '<html></html>', 'authored': ''}, ValueError),
+    ({'dom': '<html></html>', 'authored': '<html></html>', 'extra': 'untrusted'}, ValueError),
+])
+def test_private_collector_requires_both_valid_views(value, error):
+    from backend.app.extraction.browser_runner import _collected_views
+    with pytest.raises(error):
+        _collected_views(value)
+
+
+@pytest.mark.parametrize('name', ['dom', 'authored'])
+@pytest.mark.parametrize('multibyte', [False, True])
+def test_private_collector_bounds_each_view_independently(name, multibyte):
+    from backend.app.extraction.browser import MAX_BYTES
+    from backend.app.extraction.browser_runner import _collected_views
+    value = dict(dom='<html></html>', authored='<html></html>')
+    value[name] = '界' * (MAX_BYTES // 3 + 1) if multibyte else 'x' * (MAX_BYTES + 1)
+    with pytest.raises(OverflowError):
+        _collected_views(value)
+    value[name] = 'x' * MAX_BYTES
+    dom, encoded, authored = _collected_views(value)
+    assert dom == value['dom'] and encoded == dom.encode() and authored == value['authored']
+
+
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+@pytest.mark.parametrize('state,media,disabled', [('disabled', '', True), ('print', 'print', False), ('screen', 'screen', False)])
+def test_reparse_uses_private_sheet_state_without_changing_selector_attributes(kind, state, media, disabled):
+    from backend.app.extraction.browser_runner import _reparse
+    source, original = fixture('ALIBABA')
+    markup = inactive_authoritative_input(kind, 'stylesheet')
+    # The current sheet media can differ from markup. A selector depending on
+    # the authored STYLE attribute still matches the unchanged DOM structure.
+    markup = markup.replace('<style>', '<style media="print">').replace('.source-inactive', 'style[media="print"] + .source-inactive')
+    authored = original.replace('</head>', markup + '</head>')
+    compiled = compiled_metadata_view(authored)
+    after = _reparse(compiled, original, dict(platform='ALIBABA', source_url=source, analysis_mode='ACCOUNT_PUBLIC'),
+        authored_snapshot(authored, [dict(media=media, disabled=disabled)]))
+    assert after['extraction_status'] == ('PARTIAL' if state == 'screen' else 'PARSE_FAILED')
+
+
+@pytest.mark.parametrize('snapshot', [
+    '', '{}', 'null', '[]', '{"html":7,"sheets":[]}', '{"html":"","sheets":[]}',
+    '{"html":"<style></style>","sheets":[]}',
+    '{"html":"<style></style>","sheets":[{"media":"","disabled":0}]}',
+    '{"html":"<style></style>","sheets":[{"media":null,"disabled":false}]}',
+    '{"html":"<style></style>","sheets":[{}]}',
+])
+def test_reparse_declines_malformed_authored_snapshot(snapshot):
+    from backend.app.extraction.browser_runner import _reparse
+    source, original = fixture('ALIBABA')
+    with pytest.raises(ValueError):
+        _reparse(original, original, dict(platform='ALIBABA', source_url=source, analysis_mode='ACCOUNT_PUBLIC'), snapshot)
+
+
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+@pytest.mark.parametrize('property,hidden,visible', METADATA_VISIBILITY)
+def test_private_stylesheet_delimiter_cannot_create_metadata_or_override_current_activity(kind, property, hidden, visible):
+    from backend.app.extraction.browser_runner import _reparse
+    from selectolax.parser import HTMLParser
+    source, original = fixture('ALIBABA')
+    markup = inactive_authoritative_input(kind, 'stylesheet').replace('display:none', property + ':' + hidden)
+    authored = original.replace('</head>', markup + '</head>')
+    snapshot = json.loads(authored_snapshot(authored))
+    injected = "</style><meta property='og:url' content='https://www.alibaba.com/product-detail/Injected_888888888.html'>"
+    snapshot['sheets'][0]['css'] += '.unused{--label:"' + injected + '"}'
+    assert len(HTMLParser(snapshot['html']).css('meta, link')) == 1
+    compiled = compiled_metadata_view(authored)
+    request = dict(platform='ALIBABA', source_url=source, analysis_mode='ACCOUNT_PUBLIC')
+    after = _reparse(compiled, original, request, json.dumps(snapshot))
+    assert after['extraction_status'] == 'PARTIAL'
+    selected = maybe_render(ADAPTERS['ALIBABA'][1](original, source), original, original.encode(), enabled=True,
+        renderer=lambda *_: dict(code='GAIN', outcome=after, rendered_sha256=sha256(compiled.encode()).hexdigest()))
+    assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER'
+    assert selected['supplier_data']['reviews'] == [{'text': 'Useful public review', 'source_url': source}]
+    assert selected['raw_payload']['html_sha256'] == sha256(original.encode()).hexdigest()
+    # The real current rule remains authoritative despite a markup delimiter in
+    # an unrelated declaration; changing only that rule must activate the hint.
+    snapshot['sheets'][0]['css'] = snapshot['sheets'][0]['css'].replace(property + ':' + hidden, property + ':' + visible)
+    conflict = _reparse(compiled, original, request, json.dumps(snapshot))
+    assert conflict['extraction_status'] == 'PARSE_FAILED'
+    assert 'supplier_data' not in conflict and 'raw_payload' not in conflict
+
+
+@pytest.mark.parametrize('bad_css', [None, [], {}, 1, True])
+def test_private_stylesheet_rules_require_text_before_activity_lookup(bad_css):
+    from backend.app.extraction.browser_runner import _reparse
+    source, original = fixture('ALIBABA')
+    snapshot = dict(html='<html><head><style></style></head><body></body></html>',
+        sheets=[dict(css=bad_css, media='', disabled=False)])
+    with pytest.raises(ValueError):
+        _reparse(original, original, dict(platform='ALIBABA', source_url=source, analysis_mode='ACCOUNT_PUBLIC'), json.dumps(snapshot))
+
+
+@REAL
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+@pytest.mark.parametrize('style', ['visibility:hidden', 'display:none', 'opacity:0'])
+@pytest.mark.parametrize('placement', ['inline', 'stylesheet'])
+def test_actual_introduced_hidden_identity_hints_preserve_gain(kind, style, placement):
+    foreign = 'https://www.alibaba.com/product-detail/Other_999999999.html'
+    program = (f"const hint=document.createElement({json.dumps('meta' if kind == 'meta' else 'link')});"
+               + ("hint.setAttribute('property','og:url');hint.content=" if kind == 'meta' else "hint.rel='canonical';hint.href=")
+               + json.dumps(foreign) + ';document.head.appendChild(hint);')
+    if placement == 'inline':
+        program += 'hint.style.cssText=' + json.dumps(style) + ';'
+    else:
+        program += 'hint.className="introduced-hint";const s=document.createElement("style");s.textContent=' + json.dumps('.introduced-hint{' + style + '}') + ';document.head.appendChild(s);'
+    original, html = extracted('ALIBABA', extra=program)
+    selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER'
+    assert selected['supplier_data']['reviews'] == [{'text': 'Useful public review', 'source_url': original['source_url']}]
+    assert preserves(original['supplier_data'], selected['supplier_data'])
+    assert selected['raw_payload']['html_sha256'] == sha256(html.encode()).hexdigest()
+
+
+@REAL
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+@pytest.mark.parametrize('placement', ['inline', 'stylesheet'])
+def test_actual_revealed_original_foreign_identity_hint_preserves_http(kind, placement, caplog):
+    original, html = extracted('ALIBABA', extra="document.querySelector('.source-inactive').style.display='block';")
+    html = html.replace('</head>', inactive_authoritative_input(kind, placement) + '</head>')
+    original = ADAPTERS['ALIBABA'][1](html, original['source_url'])
+    assert original['extraction_status'] == 'PARTIAL'
+    frozen = deepcopy(original)
+    with caplog.at_level(logging.INFO, logger='backend.app.extraction.browser'):
+        selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected is original and original == frozen
+    assert 'code=CONFLICT' in caplog.text
+    assert 'rendered_html_sha256' not in selected['raw_payload']
+
+
+@REAL
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+@pytest.mark.parametrize('property,hidden,visible', [('display', 'none', 'block'),
+                                                   ('visibility', 'hidden', 'visible'), ('opacity', '0', '1')])
+def test_actual_stylesheet_only_reveal_checks_current_metadata_activity(kind, property, hidden, visible, caplog):
+    rule = '.source-inactive{' + property + ':' + visible + '}'
+    source, html = fixture('ALIBABA', extra='document.querySelector("style").textContent=' + json.dumps(rule) + ';')
+    markup = inactive_authoritative_input(kind, 'stylesheet').replace('display:none', property + ':' + hidden)
+    html = html.replace('</head>', markup + '</head>')
+    original = ADAPTERS['ALIBABA'][1](html, source)
+    assert original['extraction_status'] == 'PARTIAL'
+    frozen = deepcopy(original)
+    with caplog.at_level(logging.INFO, logger='backend.app.extraction.browser'):
+        selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected is original and original == frozen
+    assert 'code=CONFLICT' in caplog.text
+    assert 'rendered_html_sha256' not in selected['raw_payload']
+
+
+@REAL
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+@pytest.mark.parametrize('property,hidden,visible', METADATA_VISIBILITY)
+def test_actual_cssom_only_reveal_checks_current_metadata_activity(kind, property, hidden, visible, caplog):
+    program = 'document.querySelector("style").sheet.cssRules[0].style.setProperty(' + json.dumps(property) + ',' + json.dumps(visible) + ');'
+    source, html = fixture('ALIBABA', extra=program)
+    markup = inactive_authoritative_input(kind, 'stylesheet').replace('display:none', property + ':' + hidden)
+    html = html.replace('</head>', markup + '</head>')
+    original = ADAPTERS['ALIBABA'][1](html, source)
+    assert original['extraction_status'] == 'PARTIAL'
+    frozen = deepcopy(original)
+    with caplog.at_level(logging.INFO, logger='backend.app.extraction.browser'):
+        selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected is original and original == frozen
+    assert 'code=CONFLICT' in caplog.text
+    assert 'rendered_html_sha256' not in selected['raw_payload']
+
+
+@REAL
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+@pytest.mark.parametrize('state', ['disabled', 'media', 'print-to-screen'])
+def test_actual_cssom_sheet_disabled_and_media_state(kind, state, caplog):
+    program = {'disabled': 'document.querySelector("style").sheet.disabled=true;',
+        'media': 'document.querySelector("style").sheet.media.mediaText="print";',
+        'print-to-screen': 'document.querySelector("style").sheet.media.mediaText="screen";'}[state]
+    source, html = fixture('ALIBABA', extra=program)
+    markup = inactive_authoritative_input(kind, 'stylesheet')
+    if state == 'print-to-screen':
+        markup = markup.replace('<style>', '<style media="print">').replace(
+            'https://www.alibaba.com/product-detail/Other_999999999.html', source)
+    html = html.replace('</head>', markup + '</head>')
+    original = ADAPTERS['ALIBABA'][1](html, source)
+    assert original['extraction_status'] == 'PARTIAL'
+    with caplog.at_level(logging.INFO, logger='backend.app.extraction.browser'):
+        selected = maybe_render(original, html, html.encode(), enabled=True)
+    if state == 'print-to-screen':
+        assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER'
+        assert selected['raw_payload']['html_sha256'] == sha256(html.encode()).hexdigest()
+    else:
+        assert selected is original
+        assert 'code=CONFLICT' in caplog.text
+
+
+@REAL
+def test_actual_private_snapshot_is_native_current_cssom_and_omits_unrelated_text():
+    import asyncio
+    from backend.app.extraction.browser_runner import _collected_views
+    html = ('<html><head><style media="print">.hint{display:none}</style><meta class="hint"></head>'
+        '<body><p data-selector="kept">PRIVATE_BODY_SENTINEL</p><script>'
+        'document.querySelector("style").sheet.cssRules[0].style.display="block";'
+        'document.querySelector("style").sheet.media.mediaText="screen";'
+        'JSON.stringify=()=>"SOURCE_ENVELOPE_SENTINEL";'
+        'Element.prototype.cloneNode=()=>null;'
+        '</script></body></html>')
+    collected = asyncio.run(collect_isolated(html))
+    dom, _, authored = _collected_views(collected)
+    snapshot = json.loads(authored)
+    assert 'display' not in snapshot['html']
+    assert 'media="print"' in snapshot['html'] and 'data-selector="kept"' in snapshot['html']
+    assert snapshot['sheets'] == [dict(css='.hint { display: block; }', media='screen', disabled=False)]
+    assert 'PRIVATE_BODY_SENTINEL' not in snapshot['html']
+    assert 'SOURCE_ENVELOPE_SENTINEL' not in authored and 'JSON.stringify' not in snapshot['html']
+    assert '<script></script>' in snapshot['html']
+    assert '<style' not in dom
+
+
+@REAL
+def test_actual_unrepresented_adopted_stylesheet_explicitly_preserves_http(caplog):
+    original, html = extracted('ALIBABA', extra='const s=new CSSStyleSheet();s.replaceSync("meta{display:none}");document.adoptedStyleSheets=[s];')
+    frozen = deepcopy(original)
+    with caplog.at_level(logging.INFO, logger='backend.app.extraction.browser'):
+        selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected is original and selected == frozen
+    assert 'code=RUNTIME_FAILED' in caplog.text
+
+
+@REAL
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+@pytest.mark.parametrize('state', ['default', 'active-inline', 'active-stylesheet', 'hidden-inline', 'hidden-stylesheet'])
+def test_actual_unchanged_head_hint_activity_and_default_admission(kind, state):
+    source, html = fixture('ALIBABA')
+    markup = inactive_authoritative_input(kind, 'stylesheet' if state.endswith('stylesheet') else 'inline')
+    if state == 'default':
+        markup = markup.replace(' style="display:none"', '')
+    elif state.startswith('active'):
+        markup = markup.replace('display:none', 'display:block')
+    if not state.startswith('hidden'):
+        markup = markup.replace('https://www.alibaba.com/product-detail/Other_999999999.html', source)
+    html = html.replace('</head>', markup + '</head>')
+    original = ADAPTERS['ALIBABA'][1](html, source)
+    frozen = deepcopy(original)
+    selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER'
+    assert selected['supplier_data']['reviews'] == [{'text': 'Useful public review', 'source_url': source}]
+    assert preserves(original['supplier_data'], selected['supplier_data']) and original == frozen
+    assert selected['raw_payload']['html_sha256'] == sha256(html.encode()).hexdigest()
+
+
+@REAL
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+@pytest.mark.parametrize('active_duplicate', [False, True])
+def test_actual_duplicate_hint_ancestor_activity_is_current(kind, active_duplicate, caplog):
+    hint = inactive_authoritative_input(kind, 'inline').replace(' style="display:none"', '')
+    markup = '<section style="display:none">' + hint + '</section><section style="display:' + ('block' if active_duplicate else 'none') + '">' + hint + '</section>'
+    original, html = extracted('ALIBABA', extra='document.body.insertAdjacentHTML("beforeend",' + json.dumps(markup) + ');')
+    with caplog.at_level(logging.INFO, logger='backend.app.extraction.browser'):
+        selected = maybe_render(original, html, html.encode(), enabled=True)
+    if active_duplicate:
+        assert selected is original and 'code=CONFLICT' in caplog.text
+    else:
+        assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER'
+        assert preserves(original['supplier_data'], selected['supplier_data'])
+        assert selected['raw_payload']['html_sha256'] == sha256(html.encode()).hexdigest()
+
+
+@REAL
+def test_actual_private_cssom_snapshot_limit_preserves_http(caplog):
+    program = 'document.querySelector("style").sheet.cssRules[0].style.setProperty("--large","x".repeat(2000001));'
+    source, html = fixture('ALIBABA', extra=program)
+    html = html.replace('</head>', '<style>.unused{display:block}</style></head>')
+    original = ADAPTERS['ALIBABA'][1](html, source)
+    frozen = deepcopy(original)
+    with caplog.at_level(logging.INFO, logger='backend.app.extraction.browser'):
+        selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected is original and selected == frozen
+    assert 'code=DOM_LIMIT' in caplog.text
+
+
+@REAL
+@pytest.mark.parametrize('kind', ['meta', 'canonical'])
+def test_actual_private_stylesheet_delimiter_preserves_metadata_structure_evidence_and_hash(kind):
+    import asyncio
+    from selectolax.parser import HTMLParser
+    foreign = 'https://www.alibaba.com/product-detail/Other_999999999.html'
+    markup = (f"<meta property='og:url' content='{foreign}'>" if kind == 'meta'
+        else f"<link rel='canonical' href='{foreign}'>")
+    value = '"</style>' + markup + '"'
+    program = 'document.querySelector("style").sheet.cssRules[0].style.setProperty("--label",' + json.dumps(value) + ');'
+    source, html = fixture('ALIBABA', extra=program)
+    html = html.replace('</head>', '<style id="authored-sheet">.unused{display:block}</style></head>')
+    collected = asyncio.run(collect_isolated(html))
+    snapshot = json.loads(collected['authored'])
+    assert len(HTMLParser(snapshot['html']).css('meta, link')) == 0
+    assert '<style id="authored-sheet"></style>' in snapshot['html']
+    assert '</style>' + markup in snapshot['sheets'][0]['css']
+    assert snapshot['sheets'][0]['media'] == '' and snapshot['sheets'][0]['disabled'] is False
+    original = ADAPTERS['ALIBABA'][1](html, source)
+    frozen = deepcopy(original)
+    selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER'
+    assert selected['supplier_data']['reviews'] == [{'text': 'Useful public review', 'source_url': source}]
+    assert preserves(original['supplier_data'], selected['supplier_data']) and original == frozen
+    assert selected['raw_payload']['public_fields']['review_bodies'] == [dict(
+        text='Useful public review', source_url=source, original_length=20, truncated=False)]
+    assert selected['raw_payload']['html_sha256'] == sha256(html.encode()).hexdigest()
+
+
+@REAL
+@pytest.mark.parametrize('platform', ADAPTERS)
+def test_actual_changed_foreign_canonical_preserves_http(platform, caplog):
+    foreign = {
+        '1688': 'https://detail.1688.com/offer/999999999.html',
+        'TAOBAO': 'https://shop999999999.taobao.com/',
+        'ALIBABA': 'https://www.alibaba.com/product-detail/Other_999999999.html',
+    }[platform]
+    source, html = fixture(platform, extra='document.querySelector(\'link[rel="canonical"]\').href=' + json.dumps(foreign) + ';')
+    if platform != '1688':
+        html = html.replace('</head>', f'<link rel="canonical" href="{source}"></head>')
+    original = ADAPTERS[platform][1](html, source)
+    assert original['extraction_status'] == 'PARTIAL'
+    with caplog.at_level(logging.INFO, logger='backend.app.extraction.browser'):
+        selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected is original
+    assert 'code=CONFLICT' in caplog.text
+    assert 'rendered_html_sha256' not in selected['raw_payload']
+
+
+@REAL
+def test_actual_rendered_model_tampering_keeps_original_authoritative_evidence():
+    name = json.dumps([ord(char) for char in 'detailData'])
+    program = ('const modelName=' + name + '.map(n=>String.fromCharCode(n)).join(\'\');'
+               'window[modelName].globalData.product.productId="999999999";'
+               'window[modelName].globalData.seller.companyName="Foreign supplier";'
+               'document.querySelector(\'script\').textContent="window."+modelName+"={};";')
+    original, html = extracted('ALIBABA', extra=program)
+    assert original['extraction_status'] == 'PARTIAL'
+    selected = maybe_render(original, html, html.encode(), enabled=True)
+    assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER'
+    assert selected['supplier_data']['supplier_name'] == 'Public supplier'
+    assert preserves(original['supplier_data'], selected['supplier_data'])
+    assert 'Foreign supplier' not in json.dumps(selected)
+    assert selected['raw_payload']['html_sha256'] == sha256(html.encode()).hexdigest()
+
+
+@REAL
+def test_actual_collector_conditional_root_opacity_hides_selected_evidence():
+    import asyncio
+    from backend.app.extraction.browser_runner import _reparse
+    source, _ = fixture(render=False)
+    html = ('<html><head><link rel="canonical" href="' + source + '">'
+            '<style>@media (min-width:1px){html{opacity:0}}</style></head>'
+            '<body><div class="shop-company-name"><h1>Invisible supplier</h1></div>'
+            '<div class="review-item">Invisible review</div></body></html>')
+    collected = asyncio.run(collect_isolated(html))
+    after = _reparse(collected['dom'], html, dict(platform='1688', source_url=source, analysis_mode='ACCOUNT_PUBLIC'), collected['authored'])
+    assert after['extraction_status'] == 'PARSE_FAILED'
+    assert 'supplier_data' not in after and 'raw_payload' not in after
+
+
+@REAL
+def test_actual_collector_does_not_recascade_after_sibling_removal():
+    import asyncio
+    from backend.app.extraction.browser import access_wall
+    html = ('<html><head><style>.gone{display:none}.gone + .wall{display:none}</style></head>'
+            '<body><i class="gone"></i><p class="wall">Please sign in</p><p>Public</p></body></html>')
+    collected = asyncio.run(collect_isolated(html))
+    assert access_wall(collected['dom']) is None
+    assert 'Please sign in' not in collected['dom'] and 'Public' in collected['dom']
+    assert '<style' not in collected['dom']
+
+
+@REAL
+def test_actual_near_capacity_collector_keeps_evidence_without_annotation_growth():
+    import asyncio
+    from backend.app.extraction.browser import MAX_BYTES
+    from backend.app.extraction.browser_runner import _reparse
+    source, html = fixture(render=False)
+    html = html.replace('</body>', '<i></i>' * 1000 + '<div class="review-item">Public review</div></body>')
+    html = html.replace('</body>', ' ' * (MAX_BYTES - 2000 - len(html.encode())) + '</body>')
+    collected = asyncio.run(collect_isolated(html))
+    assert collected is not None
+    assert len(collected['dom'].encode()) <= MAX_BYTES
+    assert len(collected['authored'].encode()) <= MAX_BYTES
+    assert 'style=' not in collected['dom']
+    after = _reparse(collected['dom'], html, dict(platform='1688', source_url=source, analysis_mode='ACCOUNT_PUBLIC'), collected['authored'])
+    assert after['supplier_data']['supplier_name'] == 'Public supplier'
+    assert after['supplier_data']['reviews'] == [{'text': 'Public review', 'source_url': source}]
+
+
 @REAL
 @pytest.mark.parametrize("program,code", [
     ('while(true){}', 'DEADLINE'),
diff --git a/backend/tests/test_postgres_tracer.py b/backend/tests/test_postgres_tracer.py
index fcf10c0..6b6b13f 100644
--- a/backend/tests/test_postgres_tracer.py
+++ b/backend/tests/test_postgres_tracer.py
@@ -87,6 +87,80 @@ def test_public_browser_transition_requires_current_claim(store):
         remove(store, analysis_id)
 
 
+@pytest.mark.skipif(os.getenv("VCT_TEST_BROWSER") != "true", reason="Actual namespace fault completion requires the controlled Linux image")
+@pytest.mark.parametrize("fault", ["refusal", "death", "output", "cleanup"])
+def test_public_browser_fault_preserves_http_owner_claim_and_next_job(store, monkeypatch, tmp_path, fault):
+    from copy import deepcopy
+    from backend.tests.test_browser_fallback import fixture, ADAPTERS
+    from backend.tests.test_browser_supervision import install_supervisor, allocation_runner
+    from backend.app.extraction import browser
+
+    marker = tmp_path / "allocation-refused"
+    runner = {"refusal": allocation_runner(marker),
+              "death": "import os,signal; os.kill(os.getpid(),signal.SIGKILL)",
+              "output": "import os; os.write(1,b'x'*2100000)",
+              "cleanup": "print('{\"code\":\"NO_GAIN\"}')"}[fault]
+    install_supervisor(monkeypatch, runner=runner,
+                       setup="import time\ns._cleanup_profile=lambda p: time.sleep(12)" if fault == "cleanup" else "")
+    url, html = fixture()
+    owner = store.resolve_user("browser_fault_owner_" + uuid4().hex)
+    other = store.resolve_user("browser_fault_other_" + uuid4().hex)
+    settings = Settings(store.database_url, "local", None, None, True, public_browser_fallback=True)
+    ids, originals, claims = [], [], []
+    _, parser = ADAPTERS["1688"]
+    complete = store.complete_processing
+
+    def current_claim(analysis_id, token, payload):
+        with pytest.raises(LeaseLost):
+            complete(analysis_id, uuid4(), payload)
+        claims.append(token)
+        return complete(analysis_id, token, payload)
+
+    monkeypatch.setattr(store, "complete_processing", current_claim)
+
+    def extract(source, **kwargs):
+        expected = parser(html, source, analysis_mode=kwargs["analysis_mode"])
+        # Freeze the exact fetched HTTP object before the actual failing attempt.
+        originals.append(deepcopy(expected))
+        selected = browser.maybe_render(expected, html, html.encode(), enabled=kwargs["browser_fallback"])
+        assert selected is expected and selected == originals[-1]
+        return selected
+
+    monkeypatch.setattr("backend.worker.main.extract_1688", extract)
+    try:
+        first = store.submit_local(url, owner["id"])
+        ids.append(first)
+        assert process_local_once(store, settings)
+        row = store.get_for_user(first, owner["id"])
+        assert row["status"] == "COMPLETED" and row["attempt_count"] == 1
+        assert row["failure_code"] is None
+        assert row["extraction_method"] == "PUBLIC_HTTP"
+        assert row["supplier_data"] == originals[0]["supplier_data"]
+        assert row["raw_evidence"] == originals[0]["raw_payload"]
+        assert "rendered_html_sha256" not in row["raw_evidence"]
+        assert store.get_for_user(first, other["id"]) is None
+        assert len(claims) == 1
+        assert complete(first, uuid4(), originals[0]) == "replay"
+        if fault == "refusal":
+            assert marker.read_text() == "MemoryError"
+        # Same live worker completes another real failure without a retry or a
+        # changed method. Actual subsequent Chromium gain is a separate G6 gate.
+        second = store.submit_local(url, owner["id"])
+        ids.append(second)
+        assert process_local_once(store, settings)
+        next_row = store.get_for_user(second, owner["id"])
+        assert next_row["status"] == "COMPLETED" and next_row["attempt_count"] == 1
+        assert next_row["supplier_data"] == originals[1]["supplier_data"]
+        assert next_row["raw_evidence"] == originals[1]["raw_payload"]
+        assert len(claims) == 2 and claims[0] != claims[1]
+        assert store.get(first)["supplier_snapshot_id"] == row["supplier_snapshot_id"]
+    finally:
+        for analysis_id in reversed(ids):
+            remove(store, analysis_id)
+        remove_user(store, owner["clerk_user_id"])
+        remove_user(store, other["clerk_user_id"])
+
+
 @pytest.mark.parametrize("guest", [False, True])
 @pytest.mark.parametrize("profile", [False, True])
 def test_alibaba_mocked_public_queue_owner_and_immutable_replay(store, monkeypatch, guest, profile):
diff --git a/_bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md b/_bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/implementation-artifacts/plan-extraction-retrospective-actions.md
@@ -0,0 +1,212 @@
+---
+title: 'Apply extraction retrospective actions'
+type: 'change'
+ticket: ''
+created: '2026-10-03'
+status: 'in-review'
+route: 'full'
+route_source: 'auto'
+review: 'thorough'
+review_source: 'auto'
+lenses_ran: ['blind-hunter', 'edge-case-hunter', 'verification-gap', 'intent-alignment']
+review_loop_iteration: 3
+baseline_revision: '50c9f37df40476c8be22f1a49af745e0a4e120e8'
+context: ['_bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction-retrospective.md']
+---
+
+<frozen-after-approval reason="user authorized all six proposals and execution on 2026-10-03">
+
+## Intent
+
+**Problem:** The extraction retrospective identified five confirmed CSS visibility defects, a confirmed decompression allocation defect, unresolved browser runtime/failure qualification, current live extension acceptance gaps and stale completion records.
+
+**Approach:** Apply the six approved proposals as tracked follow-ups: correct effective screen visibility and bound decoded allocation; qualify forced runner death, slow cleanup and allocation failure; prepare a compatible-runtime decision; execute available extension checks and preserve session-dependent acceptance; apply an evidence-based epic completion gate.
+
+## Boundaries & Constraints
+
+**Always:** Preserve source admission, identity, ownership, selected evidence, hashes/replay and bounded failure outcomes. Keep sandbox, nonroot execution, network denial and current disabled deployed fallback. Report local/container/database/deployed/manual evidence separately. Preserve existing user initiative/demo changes.
+
+**Never:** Count an unrun manual check or prior-image probe as candidate acceptance, activate or weaken Chromium without qualification, allocate a paid runtime without a concrete release decision, silently waive the epic's declared criteria or mark human-owned Done.
+
+## I/O & Edge-Case Matrix
+
+| Scenario | Expected result | Evidence |
+| --- | --- | --- |
+| Five recorded static visibility failures | Correct actual screen access status and selected evidence | Helper, adapter, fallback and actual browser regressions |
+| Compressed oversized/chunked or malformed input | Bounded decoded allocation on every path, finite explicit rejection, no snapshot | Allocations observed during decoding and valid three-platform provenance |
+| Valid representative evidence | Retain source identities, selected fields, hashes and replay | Adapter/parity/merge/database and browser gates |
+| Abrupt runner death, cleanup delay, allocation failure | Bounded termination and retained HTTP evidence; worker survives; descendants accounted for | Actual sandboxed Linux container fault qualification |
+| Deployed incompatible/unqualified runtime | Remain disabled; exact environment and concrete alternatives recorded | Read-only diagnostics and prepared human scope/release decision |
+| Source session unavailable | Automated support recorded; live wire/shop/result journey pending | Browser inventory and actionable manual checklist |
+| Unresolved required criterion or superseded follow-up | Full acceptance rejected/pending; historical evidence preserved and concerns mapped | Applied completion gate and inventory audit |
+
+</frozen-after-approval>
+
+## Code Map
+
+- Shared extraction DOM, browser collector and fetch boundaries; implementation detailed in independent bug9/10 plans.
+- Browser supervision/runner and actual fault probes; qualification detailed in story12 plan.
+- Extraction ticket tree, runtime decision, extension checklist, completion gate and execution ledger.
+- Deferred-work inventory; reconcile only sourced extraction concerns, preserving unrelated entries.
+
+### Review loop 1 re-derivation
+
+The parent archived the positive implementation in `tmp/retro-review-keep/` before reverting task code to the canonical baseline. `manifest.json` lists each owned source/test path and its preservation copy. Restore the positive implementation as the starting implementation material, then implement the corrections below; never restore unrelated user changes or initialize BMad again. This is the parent's step-03 re-derivation handoff. No commit, remote operations, wider tests or cloud changes by the implementer. Parent owns final image, shared gates and review.
+
+1. `backend/app/extraction/fetch.py`, `test_response_limits.py`: bounded first-decode replay must retain HTTPX-compatible raw-deflate fallback when a valid raw stream starts with a plausible zlib header. Reproducer: raw stored block `78 9c 00 63 ff`, 156 bytes of HTML, then `01 00 00 ff ff`. Preserve wrapped checksums, truncation/trailing-data rejection, per-call/cumulative decoded bounds, fragmentation, hashes and deadlines. Bound replayed wire bytes; do not retry a damaged wrapped stream after decoded output was accepted. Record any format boundary precisely. Resolve this algorithm explicitly rather than relying only on two-byte header heuristics.
+2. `browser_runner.py`, `test_browser_fallback.py`: compile a minimal inert visibility view after snapshotting effective styles, including the document root. Removing or annotating nodes must not recascade source selectors or inflate a valid near-cap source beyond the configured DOM capacity through gratuitous collector annotations. Remove obsolete source visibility styles and preserve only effective hidden/restored visibility needed by the static consumers. Preserve source model/canonical authority, native isolated collection and the original byte hash. Qualify root opacity under conditional screen CSS, near-cap collector overhead and mutable main-world Number with a transient wall. Capture the needed native numeric intrinsic before source execution. Keep sandbox, guards, timers and budget unchanged.
+3. `dom.py`, `test_dom_visibility.py`: recognize author-origin `revert` for the three supported properties. Roll back to the supported origin's default/inherited behavior rather than retaining an earlier author hiding declaration. Add stylesheet and inline priority/inheritance cases. Leave unsupported selectors/Unicode and transient-attribute observation as sourced pre-existing follow-ups; do not silently broaden those boundaries.
+4. `taobao.py`, `alibaba.py`, `test_dom_visibility.py`: require a visible link or restored visible descendant before selecting a Taobao shop URL; visibility-hidden password controls must not create an Alibaba access wall. Preserve restored-child semantics and visible URLs whose title alone is hidden. Add consumer assertions for normalized/raw fields and statuses. Add model-free hidden 1688 supplier/title cases checking normalized/raw evidence, missing fields, completeness and original hashes.
+5. `browser.py`, `test_browser_supervision.py`, `test_postgres_tracer.py`: automatic deferred cleanup must receive a useful bounded portion of the current ten-second deadline, not an endlessly repeated 0.5-second window. Demonstrated fault: healthy deletion delayed 0.7 seconds is killed on every subsequent attempt, leaving enrichment unavailable indefinitely. Reuse the existing absolute deadline and reserve; do not enlarge the overall budget or add helpers/backlog. Add recovery through the normal entry point, with actual subsequent gain and original HTTP provenance, without a test manually draining the private slot. Remove manual cleanup intervention from the database next-job recovery assertion where it masks the consumer behavior. A4's unobserved DOM/encoding allocation and restart profile reclamation stay explicitly open.
+
+KEEP: all five baseline-failing CSS reproductions; cascade/important/inheritance/media/opacity semantics; bounded raw decoding and allocation observations; valid three-platform hashes/selected evidence; fresh temporary-profile startup optimization; namespace PID1 ownership, nonzero maps/capability drop, parent-death process chains, bounded OWNER/READY/ACK/IPC, one cleanup slot; durable ownership/current-claim/replay; secret-free environment, network/CSP/storage denial; immutable evidence and disabled deployed fallback. Preserve every passing security/function test and truthful pending gate. Use the project `.venv/Scripts/python.exe` on Windows; system Python lacks dependencies. Actual scoped verification may use a controlled temporary image/read-only overlays, explicitly labeled; parent builds final immutable image.
+
+### Review loop 2 re-derivation
+
+Restore the positive implementation from `tmp/retro-review2-keep/manifest.json` and its listed copies before the corrections below. Parent archives and reverts only the fifteen listed task-owned source/test/CI/dependency paths; all ticket/docs and unrelated user files remain preserved. The build workflow is already initialized: do not render or restart any skill. The frozen intent and all loop 1 KEEP behavior remain binding. Make scoped changes directly, run only covering checks, report every changed path and any remaining gate, and do not commit or perform remote/cloud/database reconfiguration. Parent owns the final immutable image and shared verification.
+
+1. `browser_supervisor.py`, `test_browser_supervision.py`: close the demonstrated pre-arm bootstrap-death race. The existing one-way gate can retain byte `1` after bootstrap dies before init calls PR_SET_PDEATHSIG; init then reports READY and launches a runner. Parent actual injection delayed init's arming by 0.3 seconds and killed bootstrap immediately after writing the gate; the runner marker was created. Require positive confirmation that init has armed its parent-death signal before bootstrap releases the launch gate, with bounded internal communication. A two-way trusted socket/pipe handshake is suitable: init arms first, confirms, then waits for release; bootstrap receives confirmation before release. Bootstrap death before confirmation must close the gate without launch, and death after arming must kill init. Keep OWNER/READY/ACK and retained outer PID1 ownership before source launch, nonzero maps, capability drop, all descriptor closure and the same deadline. Add a deterministic pre-arm death test with no runner marker, all owned processes gone and unrelated sentinel alive. Preserve existing death-chain gates.
+2. `browser.py`, covering fallback/supervision tests: correct ordinary deadline profile cleanup. Parent immutable image and isolated regression both left a profile after an infinite script at ten seconds. Current finally kills the already warm bootstrap as well as init; cold replacement cleanup startup consumes the remaining reserve. Signal init first, let its existing bootstrap reap and delete the profile within the remaining absolute deadline, and retain the bootstrap pidfd until that bounded wait finishes. If it stalls, terminate it independently and retain the single deferred slot. Missing owner/signal failures still terminate safely, helpers/backlog stay capped, no overall budget increase, and descriptors must close even on errors. A read-only diagnostic variant passed the existing ordinary DEADLINE regression, so preserve that assertion rather than weakening it. Run ordinary infinite-script/DOM-limit/conflict cleanup and delayed cleanup recovery, denied prerequisites, independent stalls and direct death-chain checks under unchanged controls.
+3. `dom.py`, `test_dom_visibility.py`: direct corrections for two new supported-CSS regressions. Accept valid `display:inline list-item` after earlier hiding; baseline exposes its wall while current value validation discards it. Correct quoted attribute-selector tokenization/specificity for `[data-x="]"]`: baseline and selectolax match its hiding rule, current bracket regex rejects it. Use the existing parsed tokens or a minimal quoted-attribute correction without broadening unsupported pseudo/Unicode/function boundaries. Cover classification and selected consumer evidence, source hashes and priority/order.
+4. `browser_runner.py`, `test_browser_fallback.py`: capture the native includes operation used by the new visibility traversal before source execution. Parent actual probe overriding Array.prototype.includes only for P let a transient CAPTCHA disappear and gained evidence; the baseline guard reports BLOCKED. Normalize visible whitespace before spending the 2,000-character normalized-text budget; 5,000 collapsible spaces preceding a transient CAPTCHA currently use the raw budget, while baseline reports BLOCKED. Preserve finite visible traversal and native style/text APIs; use a captured normalizer to avoid introducing a new mutable operation. Add actual transient-wall tests for both demonstrated regressions. BR/block phrase separators remain the separately verified pre-existing follow-up; do not broaden that behavior here. Add the pre-verified temporal CAPTCHA→login regression asserting sticky BLOCKED/ACCESS_CHALLENGE and no snapshot.
+5. `test_response_limits.py` or existing default-client harness: add the pre-verified negotiation regression without supplying a client. Server chooses compressed response from the actual request's Accept-Encoding, then assert supported gzip/deflate negotiation, selected three-platform evidence and original decoded byte hash. Existing injected-client decompressor tests alone do not cover production default negotiation.
+
+6. Parent integration during this re-derivation: `browser_runner.py` and covering browser tests must preserve original inactive identity/model semantics when compiling the inert view. `COLLECT_DOM` strips every style attribute and source stylesheet; an unchanged Alibaba `<meta property="og:url" content="https://www.alibaba.com/product-detail/Other_999999999.html" style="display:none">` is ignored by original parsing but becomes active after collection, making `_reparse` return PARSE_FAILED/MALFORMED_PAGE instead of preserving valid evidence. Original models/identity hints must retain their original supported-static activity when otherwise unchanged; do not reactivate source-inactive script models solely because visibility styles were compiled away. Newly introduced or changed rendered identity hints still undergo existing binding checks; do not restore an entire head or silently override changed canonical URLs. Use the existing shared original-source activity resolver for original inputs and retain that semantics in reparsing without retaining body CSS that can recascade after pruning. Add inline and supported stylesheet-hidden foreign-hint cases plus an inactive extra model case, requiring actual gain/valid selected evidence and original byte hashes. Existing rendered foreign-canonical/model tampering tests remain mandatory. Keep the compiled DOM size bound and isolated collection; no new public surface or weakened identity check.
+
+Pre-existing CSS work complexity, ARIA/hidden conventions, all shorthand and visibility-hidden structural shelf selection are evidenced follow-ups, not new implementation in this loop. Worker-restart profile reclamation, normal DOM/encoding allocation failure, durable post-OOM completion/gain and deployed/manual gates stay explicitly unqualified. Parent's actual normal-encoding probe reached isolated collection but observed no allocation failure and retained HTTP at the deadline; a subsequent ordinary gain passed. It does not close G4.
+
+### Review loop 3 re-derivation
+
+Restore the positive fifteen-path implementation from `tmp/retro-review3-keep/manifest.json` and its listed copies, then implement this corrected private collector design. Earlier loop sections are historical correction/KEEP requirements; this section governs current metadata activity. Do not restart BMad, commit, perform remote operations, change cloud/database configuration or edit parent-owned records. Use the project virtual environment and run only covering checks. Parent owns the new immutable image, integration and four-lens review.
+
+1. `browser_runner.py`, `test_browser_fallback.py`: capture a bounded private view of current authored metadata activity **before** removing CSS or pruning/annotating the rendered tree. Current body compilation loses authored styles, while matching an original hint by unchanged attributes restores stale inactivity when a source changes only its stylesheet. The six actual stylesheet-only display/visibility/opacity reveal cases for META/LINK fail with browser gain instead of conflict. Inline styles alone cannot resolve this; ordinary head META/LINK also have UA-default display:none, so computed display alone cannot define identity admission.
+2. Use the existing shared supported-static activity resolver on a separate, native-isolated, current authored structure/style snapshot. Preserve selector-relevant element structure/attributes, inline styles and current authored stylesheet rules, including CSSOM edits whose STYLE text is unchanged and current disabled/media state; omit source script bodies and unrelated body text from this private view. Native-isolated CSSOM serialization must represent currently applied author rules rather than stale markup. Include a CSSOM-only rule mutation regression; any unrepresented author-sheet path must fail explicitly rather than restoring stale original inactivity. Bound its serialized UTF-8 bytes to MAX_BYTES before Python reparsing, separately from the compiled selected DOM's unchanged MAX_BYTES limit. The two private strings together are bounded by twice MAX_BYTES plus finite envelope overhead; they are local runner inputs, never public evidence or stdout. Do not inflate the compiled selected DOM with per-node activity markers, weaken its capacity test or silently omit snapshot validation. Check private return types, missing/malformed values and capacity explicitly, preserving HTTP on failure. Source cannot provide or replace the isolated collector's return envelope.
+3. Serialize stylesheet rule text as separate private JSON data, never raw STYLE text inside the snapshot HTML: a CSSOM string containing </style> must not be reinterpreted as HTML or create metadata/style nodes. Keep native-cloned STYLE elements/attributes in their selector positions, but apply the validated private rules/media/disabled state through document-local resolver state before the first activity lookup. Add local and actual stylesheet-delimiter regressions proving unchanged metadata structure, current activity and selected evidence/hash preservation. Apply current activity from that snapshot to rendered META/LINK hints, including unchanged, introduced, duplicated and stylesheet/inline-revealed hints. An active foreign hint must reach the existing identity checks; a currently author-hidden hint must not become active through compilation. Preserve UA-default head metadata admission and existing original canonical behavior. Current CSS may influence this private metadata resolver only; compiled body evidence remains CSS-free and must not recascade after pruning. Original script/model authority and original script activity stay bound to the original HTTP source, never the rendered snapshot.
+4. Preserve the already passing direct third-review corrections: ruby value order/priority and selected evidence; captured native invocation/regexp execution bypassing Function.call, Symbol.replace, RegExp.test/exec tampering; normalized-text budget and sticky BLOCKED; ancestor-inline/stylesheet-hidden original script regression coverage. Add local and actual current-metadata regressions for all three visibility properties, both META/LINK, introduced hidden hints, unchanged active/hidden/default head hints, duplicates, changed identity, original model authority and selected/raw hashes. Keep near-capacity and existing security/three-platform gain cases mandatory. Negative controls must demonstrate the stylesheet-only reveal gate catches stale-original activity.
+
+KEEP: all prior fifteen-path positive source, including the 194-case immutable browser/supervision checkpoint, sixteen database cases, kernel OOM and narrow native-encoding/durable-OOM observations; no prior image qualifies this changed runner. The scoped third-review latch selection passed 36 actual cases and initial metadata selection 40 actual cases; ruby's negative control failed ten assertions. Preserve every passing supervision, decoding, consumer, security and provenance gate and the current disabled deployed fallback. Existing unsupported CSS, attribute-only latch/phrase, restart, remaining native-allocation, deployed/manual gates retain their explicit owners and pending states. Do not add their implementation to this re-derivation.
+
+## Tasks & Acceptance
+
+- [x] Apply six proposals in the ticket tree, with explicit prerequisites.
+- [x] Implement and regress baseline-confirmed CSS and decompression defects.
+- [ ] Run actual browser failure qualification and correct demonstrated defects.
+- [x] Prepare runtime decision and live extension checklist; run available automated extension gates.
+- [x] Apply completion gate and reconcile obsolete extension construction item.
+- [ ] Review the unified task diff, triage every finding and run necessary candidate gates.
+- [ ] Record truthful ticket states and create a scoped local commit.
+
+## Implementation Notes
+
+The independent accepted-scope plans drive sequential implementation handoffs. The parent owns integration, shared gates and one thorough review of the unified action-set diff; findings are also linked from affected ticket plans. The runtime/manual decisions stay pending until their explicit prerequisites hold. No additional human permission is needed for already approved implementation.
+
+## Plan Change Log
+
+- 2026-10-04, loop 1: B1/E3 exposed an underspecified raw-deflate format decision; B8 exposed unbudgeted collector annotation growth. Amended the non-frozen Code Map with bounded replay and a minimal inert visibility view. Known-bad states avoided: valid raw HTML rejected by header coincidence; valid near-cap evidence rejected solely by collector-generated styles. KEEP instructions above retain the verified improvements. Related direct regressions and consumer gaps are included in this re-derivation; lower patch entries are superseded by it. Frozen intent/constraints remain unchanged.
+- 2026-10-04, loop 2: R2-E4 demonstrated that the one-way bootstrap gate does not prove init armed PDEATHSIG before bootstrap death. Amended the non-frozen ownership protocol to require positive arming confirmation before release. Known-bad state avoided: launching a runner after bootstrap died before arming. Preserve all loop 1 positive source via the new fifteen-path manifest, including successful three-platform/security/allocation checks. Direct cleanup, CSS, intrinsic/whitespace and covering-test corrections are incorporated in the same re-derivation. Frozen constraints and pending acceptance remain unchanged.
+- 2026-10-04, loop 3: R3-B2/E2's inline correction passed, but six actual stylesheet-only reveal cases still gained evidence after an original foreign hint became active. The needed current authored state is lost during compilation; this is `bad_plan`, superseding the earlier direct-patch route for that group. Amended the non-frozen collector handoff to carry a separately bounded private structure/style view into the existing static activity resolver. Known-bad states avoided: restoring stale original inactivity, treating UA-default metadata as author-hidden, and allowing retained CSS to recascade body evidence. Archive fifteen positive paths before reverting only task code; restore all prior KEEP behavior, including the other direct third-review patches. Frozen intent is unchanged, no public evidence/acceptance surface is added and no pending operational gate is waived.
+
+## Review Triage Log
+
+All four lenses reported before classification. Each reported finding is recorded separately before root-cause grouping.
+
+| ID | Lens / claim | Verdict | Evidence and route |
+| --- | --- | --- | --- |
+| B1 | Blind: ambiguous raw-deflate header | medium | Valid 156-byte stored block starting 78 9c decompresses with raw zlib but candidate rejects. Two-byte-only format choice loses previous first-decode fallback. `bad_plan`, grouped with E3; explicit bounded algorithm required. |
+| B2 | Blind: mixed supported/pseudo selector list | medium | Baseline and candidate both leave `.wall,.other:hover{display:none}` visible; exact baseline comparison disproves a new regression. Pre-existing unsupported-selector boundary; `defer`. |
+| B3 | Blind: Unicode/escaped identifiers | medium | Baseline and candidate both ignore `.登录{display:none}`; baseline selector whitelist is ASCII too. Unicode/escape semantics require separate qualification; `defer` as pre-existing. |
+| B4 | Blind: revert discarded | medium | Baseline stylesheet `display:none;display:revert` leaves text visible; candidate hides it. Winning author rollback must supersede earlier author hiding. Direct correction to existing value resolution, `patch`; included in re-derivation. |
+| B5 | Blind: root computed opacity omitted | medium | Collector snapshots body only; html opacity is non-inherited and conditional rule is ignored on static reparse, so invisible evidence survives. `patch`, grouped with E5; included in re-derivation. |
+| B6 | Blind: mutable Number defeats visibility latch | high | New opacity guard calls source-mutable Number; overriding it to zero makes every text node invisible until a transient wall is removed before isolated collection. Capture native intrinsic and qualify transient wall; `patch`, included in re-derivation. |
+| B7 | Blind: attribute mutations unobserved | medium | Baseline observer already omits attributes; transient style/class-only reveal is a pre-existing lifecycle gap, not caused by this diff. `defer`; would require an actual reveal/hide qualification and performance assessment. |
+| B8 | Blind: annotation-generated DOM overflow | medium | Three declarations are added to every retained element before the 2 MB check; roughly 1,000 nodes add tens of KB to a valid near-cap source. Algorithm lacks a collector-overhead policy. `bad_plan`; minimal inert view specified above. |
+| B9 | Blind: worker-death profile accumulation | medium | Actual death probe leaves interrupted directory; baseline TemporaryDirectory also cannot run on SIGKILL. No persistent restart reclamation exists; A4 stays incomplete. `defer` as pre-existing, qualification required before activation. |
+| B10 | Blind: normal DOM allocation/recovery unobserved | medium | Synthetic allocator bypasses normal collection/encoding/reparse; this was an original unqualified hypothesis and remains explicitly open. `defer`; actual boundary allocation plus durable completion and subsequent gain would settle it. |
+| E1 | Edge: hidden Taobao links selected | medium | Candidate selects 20 invisible shop URLs in fixture; baseline selects none. Visibility-hidden structure is now retained and the URL consumer lacks active/visible-descendant check. `patch`; included in re-derivation. |
+| E2 | Edge: hidden Alibaba password gives auth wall | medium | Sparse hidden password returns AUTH_REQUIRED in candidate and no access classification in baseline. Presence check now sees retained invisible control. `patch`; included in re-derivation. |
+| E3 | Edge: raw-deflate prefix ambiguity | medium | Independently verified valid raw bytes/header coincidence as for B1. Same format-decision root cause; `bad_plan`, grouped with B1. |
+| E4 | Edge: br-separated login phrase | medium | New traversal concatenates text without layout separators; baseline innerText retains newlines but its literal phrase regex also misses this br-separated phrase. Specific claimed outcome is pre-existing; `defer`. |
+| E5 | Edge: conditional html opacity | medium | Same verified omitted-root boundary as B5; `patch`, grouped with B5. |
+| V1 | Verification: hidden 1688 headings lack consumer tests | medium | Pre-verified mutation survived 427 local passes; current tests hide reviews, not supplier/title headings. Add model-free normalized/raw/missing/completeness/hash assertions, `patch`; included in re-derivation. |
+| V2 | Verification: cleanup recovery uses private intervention | high | Pre-verified gap; exact image subsequently reproduced repeated 501 ms declines. Focused 0.7-second deletion probe declined forever across three normal attempts. Automatic recovery/gain is untested. `patch`, grouped with integration P1; included in re-derivation. |
+| I1 | Intent: staged versus full qualification surfaces | false | Auditor confirms staged remediation reading is implemented and all unavailable operational surfaces are labeled pending. User explicitly retains deployed requirement with full acceptance pending. No claimed full acceptance is contradicted; no code correction for this descriptive assessment. |
+| P1 | Parent integration: cleanup starvation | high | Exact-image union 59 failures and DB 6 failures after initial deadline; isolated ordinary gain passes. A finite 0.7-second deletion is repeatedly killed at 0.5 seconds with the same pending slot. Give recovery useful time within the existing absolute deadline; direct `patch`, grouped with V2 and included in re-derivation. |
+
+Root-cause groups: B1+E3 and B8 route `bad_plan` and trigger this loop; direct patch groups are incorporated into re-derivation rather than separately processed before it. Pre-existing groups B2, B3, B7, B9, B10 and E4 remain follow-ups. No finding is silently dismissed or used to waive acceptance.
+
+### Review loop 2 findings
+
+All four lenses returned before classification. Baseline/static comparisons are recorded in `tmp/verify-review2-static.py`; actual kernel/latch comparisons in `tmp/verify-review2-runtime.py`. Every finding has its own verdict before grouping.
+
+| ID | Lens / claim | Verdict | Evidence and route |
+| --- | --- | --- | --- |
+| R2-B1 | Blind: unbounded CSS rule/match work | medium | Both baseline and candidate repeat selector matching per rule with no work bound. For 800 universal hiding rules/1,000 nodes baseline took 0.391 s and candidate 0.765 s; visible rules took 0.032/0.781 s. The unbounded quadratic path predates this change; `defer`, retain performance boundary as follow-up, no claimed parser-time guarantee. |
+| R2-B2 | Blind: ARIA/hidden unconditional suppression | medium | Baseline and candidate both remove aria-hidden text and hidden text overridden with display:block. Existing evidence-selection convention, not a new regression; `defer` for separately qualified semantics. |
+| R2-B3 | Blind: all shorthand ignored | medium | Baseline and candidate both suppress display:none;all:initial. Pre-existing shorthand boundary; `defer`. |
+| R2-B4 | Blind: valid inline list-item override ignored | medium | Stylesheet display:none;display:inline list-item leaves Captcha visible at baseline and removes it in candidate. Direct supported value validation regression; `patch`, incorporated below. |
+| R2-B5 | Blind: quoted bracket attribute selector rejected | medium | Baseline removes `[data-x="]"]` wall, candidate leaves it visible; existing selector engine matches it. Direct specificity/tokenization regression; `patch`, grouped with R2-E3. |
+| R2-B6 | Blind: restored descendant under hidden shelf omitted | medium | Exact fixture returns no products at both baseline and candidate. Shelf discovery uses active-only structural container filtering before descendant selection; pre-existing consumer boundary, `defer`. |
+| R2-B7 | Blind: source-mutated Array.includes bypasses latch | high | Actual current probe reports GAIN after transient P CAPTCHA disappears; same collector with baseline guard reports BLOCKED. Native-capture omission in new traversal; `patch`. |
+| R2-B8 | Blind: restart profile cleanup missing | medium | carried from B9: production slot remains in memory, worker-death profile remains, test cleans it independently. Same unchanged restart reclamation claim/route; no repeated patch or deferral. |
+| R2-B9 | Blind: normal DOM/encoding allocation unobserved | medium | carried from B10: synthetic render allocator does not qualify native collection/encoding/reparse, explicitly open. Parent native-path probe reached collection without observed allocation refusal; same deferred qualification remains. |
+| R2-B10 | Blind: durable post-OOM completion/gain untested | medium | carried from B10's unchanged progress qualification: kernel probe records caller survival/HTTP only; database faults omit OOM. Required G4 completion/recovery remains open, no repeated patch or deferral. |
+| R2-E1 | Edge: BR/block phrase concatenation | medium | carried from E4: baseline literal phrase matching also misses BR-separated login text. Same pre-existing outcome/route; no repeated correction or deferral. |
+| R2-E2 | Edge: whitespace uses prefix budget before collapse | medium | Actual 5,000-space transient CAPTCHA returns GAIN in current guard and BLOCKED with baseline guard. New raw-text prefix spends the budget before normalization; `patch`. |
+| R2-E3 | Edge: quoted bracket selector ignores hidden CAPTCHA | medium | Same independently verified baseline/current selector result as R2-B5, `patch`, grouped only after separate verdict. |
+| R2-E4 | Edge: bootstrap death before init arming | high | Actual delay of init arming by 0.3 s plus SIGKILL immediately after bootstrap gate write creates runner marker after bootstrap death; caller retains HTTP. One-way gate lacks arming confirmation. `bad_plan`, requires explicit trusted protocol decision and loop 2. |
+| R2-V1 | Verification: default-client negotiation untested | medium | Pre-verified mutation advertising br survived eight default-client cases; header-selected server changes PARTIAL to HTTP_ERROR. Add production-default negotiation/decoded hash regression; `patch`. |
+| R2-V2 | Verification: sticky BLOCKED temporal precedence untested | medium | Pre-verified existing tests never present login after a detected CAPTCHA. Removing sticky guard permits overwrite while static/transient-only tests stay green; add actual temporal regression, `patch`. |
+| R2-I1 | Intent: staged versus completed qualification | false | carried from I1: descriptive audit confirms staged remediation reading with incomplete operational gates named. Full epic acceptance remains pending as explicitly chosen by user; no claimed completed qualification contradicted. |
+| R2-P1 | Parent: ordinary deadline leaves profile | high | Immutable union 105 passes/one failure and isolated one failure; both ordinary infinite-script profile assertions fail. Diagnostic showed bootstrap killed at 9.5 s, cold helper still starting at 10 s; bounded warm-bootstrap variant passes existing assertion. Direct cleanup-order correction, `patch`. |
+| R2-P2 | Parent integration: inert compilation activates source-inactive hints | medium | Original Alibaba fixture plus inline-hidden foreign og:url parses PARTIAL; stripping that style as the collector does makes `_reparse` return PARSE_FAILED/MALFORMED_PAGE. Original supported-static metadata/model activity must survive CSS removal while changed hints remain checked. Direct `patch` of the existing authoritative-input restoration, dispatched to the same implementer during loop 2 with covering tests; source identity constraints remain unchanged. |
+
+Grouping: R2-B5+R2-E3 share selector tokenization; other patches remain independent. R2-E4 `bad_plan` triggers re-derivation, so lower patches are included in the plan rather than processed separately. Deferred routes remain held for final review completion; carried rows are not reprocessed. No scope/activation waiver follows these findings.
+
+### Third review findings — completed with human-supplied edge report
+
+All four reports are now available: the user returned the missing edge JSON on 2026-10-04. Saved reports are in `../../tmp/retro-final2-results/`; new static comparisons and actual sandbox probes are in `../../tmp/verify-review3.py` and `verify-review3-runtime.py`. Each finding is graded before grouping; the frozen intent remains unchanged.
+
+| ID | Lens / claim | Verdict | Evidence and route |
+| --- | --- | --- | --- |
+| R3-B1 | Blind: valid ruby override discarded | medium | Same-declaration display:none;display:ruby leaves login text visible at baseline and hidden in candidate. Separate-rule hiding already predates this change, but the reported same-declaration regression is new. Direct value correction, `patch`. |
+| R3-B2 | Blind: introduced hidden hint becomes active | medium | New Alibaba foreign og:url with inline visibility:hidden is ignored before compilation (PARTIAL) and becomes PARSE_FAILED afterward. Actual candidate loses eligible browser gain and retains PUBLIC_HTTP. The inline patch passed, but the shared current-activity root needs a trusted bounded precompilation snapshot; `bad_plan`, grouped with R3-E2 in loop 3. |
+| R3-B3 | Blind: mutable invocation/matching bypasses latch | high | Actual selective Function.prototype.call mutation returns PUBLIC_BROWSER in candidate and BLOCKED with baseline guard. RegExp.prototype.test mutation bypasses both guards, so that subcase is pre-existing; correct native invocation and matching coherently in the private latch. Direct `patch`, no public surface. |
+| R3-B4 | Blind: attribute-only reveal unobserved | medium | carried from B7: observer still excludes attribute changes, and that behavior predates this diff. Same deferred lifecycle qualification; do not reverify or defer again. |
+| R3-B5 | Blind: layout-separated phrases omitted | medium | carried from E4/R2-E1: BR-separated phrases have the same pre-existing classification gap. Same deferred route, no repeated correction or deferral. |
+| R3-B6 | Blind: restored child under hidden shelf omitted | medium | carried from R2-B6: structural active-only shelf discovery is unchanged and baseline also omits the product. Same deferred consumer boundary, no repeat. |
+| R3-B7 | Blind: static CSS work has no bound | medium | carried from R2-B1: matching remains multiplicative in rule/node counts and baseline also lacks a work budget. Same deferred performance boundary, no repeat. |
+| R3-B8 | Blind: restart profiles unreclaimed | medium | carried from B9/R2-B8: worker-death profile remains and production has no persistent restart reclamation. Same deferred/open A4 route, no repeat. |
+| R3-B9 | Blind: normal allocation tests bypass render | medium | carried from B10/R2-B9: committed allocator tests still replace render. Parent separately observed normal UTF-8 MemoryError and subsequent caller gain; isolated serialization, reparsing and durable native-fault completion remain unobserved. Same open qualification, no repeat. |
+| R3-B10 | Blind: OOM test omits durable next-job recovery | medium | carried from R2-B10: the referenced committed kernel test checks caller/HTTP only. Parent's separate exact-image probe now observes durable HTTP completion and subsequent browser completion, but that broader probe is not the committed test. Same qualification/registration follow-up, no repeat. |
+| R3-E1 | Edge: native replace dispatch remains mutable | high | Actual RegExp.prototype[Symbol.replace] override bypasses current latch (PUBLIC_BROWSER, 8.458 s); baseline guard reports BLOCKED (6.639 s). Capturing String.replace alone still invokes the source-mutable regexp protocol. Direct native normalization correction, `patch`. |
+| R3-E2 | Edge: revealed foreign hint stays ignored | high | Original inline-hidden foreign og:url yields PARTIAL; changing only its style to display:block still yields PARTIAL in _reparse. Actual source reveal gains PUBLIC_BROWSER (6.410 s). Including inline style fixes that reproduction, but six actual stylesheet-only reveals still gain with identical metadata attributes. Compilation discarded current authored activity; `bad_plan`, grouped with R3-B2 for the bounded private snapshot decision in loop 3. |
+| R3-V1 | Verification: ancestor-hidden script regression missing | medium | Pre-verified mutation loses ancestor-derived inactivity while nine targeted reparsing cases and 509 local checks still pass. Add inline/stylesheet ancestor-hidden script consumer and actual browser gain/hash cases, `patch`. |
+| R3-I1 | Intent: staged qualification versus operational closure | false | carried from I1/R2-I1: audit confirms staged remediation and explicitly pending broader gates. No claimed full acceptance is contradicted; no correction. |
+
+Grouping: R3-B2 and R3-E2 share loss of metadata's current authored activity during compilation/restoration. They initially routed to the same implementer's direct patch; the verified stylesheet-only failures require a nontrivial private snapshot decision and now trigger bad_plan loop 3. Other direct corrections survive as KEEP implementation and covering tests. Unchanged deferred findings are carried only; ten first-instance entries were appended once before the additional reproduction and must not be duplicated. No intent gap, activation waiver or epic completion is inferred.
+
+## Verification
+
+Run allocation/visibility regressions and affected adapter/replay/merge tests; database-backed extension/queue ownership; frontend tests/types; immutable Linux candidate sandboxed browser and fault qualification. Measure forced-death/cleanup/allocation outcomes independently, with exact controls and honest skipped/failure rows. A3 paid/deployed activation and A5 live session checks remain separately gated.
+
+### Loop 3 frozen implementation checkpoint — 2026-10-04
+
+The final implementation handoff is `../../tmp/retro-review3-results/implementation-handoff.md`. All fifteen frozen hashes matched before parent integration. The corrected private metadata snapshot keeps CSSOM rules as JSON data outside HTML; the native current stylesheet state is applied through private document-local resolver fields, while body evidence remains inert and original models remain authoritative. Final scoped checks passed 637 local cases (208 explicit gated skips) and 58 container cases (38 actual Chromium, 20 local, zero skips); six diagnostic negative controls reproduced the prohibited stale-activity gain. Earlier development selections are supporting history only.
+
+New immutable candidate: `sha256:79ac65deea5f1cf27ed4cea01db584b9f5f8fd8b77dcdf0e619829427d8e4b22`. Image verification matched all fourteen backend source/test/dependency hashes at UID10001, without production overlays. Parent read the complete normalized code delta against loop 3 KEEP copies (684 lines). Whole backend passed 1,225 cases with 213 explicit gated skips (222.50 s); the actual immutable browser/supervision gate passed 339 cases with zero skips and one separate OOM deselection (1,284.71 s). The database browser/ownership/fault gate passed all sixteen selected cases, zero skips (98.87 s), and the separately registered kernel-OOM gate passed its one case (8.17 s, 1 GiB peak, oom/oom_kill each +1, HTTP preserved). Results are in `../../tmp/retro-final3-results/`. These current-image passes supersede earlier candidate measurements below without closing A4 or deployed/live acceptance.
+
+Three further current-image durable probes passed: real kernel OOM preserved/completed HTTP at 6.852 s, then the same worker completed browser gain at 7.453 s; actual isolated collection returned 650,397 characters before induced native UTF-8 MemoryError at `_collected_views:242`, preserving/completing HTTP with RUNTIME_FAILED at 8.380 s and subsequent browser gain at 7.268 s; native reparsing MemoryError was directly traced at `_reparse:254`, `HTMLParser(dom)`, preserving/completing HTTP with RUNTIME_FAILED at 8.553 s and subsequent browser gain at 7.372 s. Owner isolation, distinct current claims, immutable replay/snapshot and cleared cleanup slot passed in each. Only runner address space was lowered for the two native faults; they are not inferred from timeouts. These read-only harnesses remain supporting local qualification rather than permanent CI registration. Isolated-world serialization, restart profile reclamation, the broader Chromium timing matrix and guaranteed shared-cgroup isolation remain open; source-session inventory still has no accessible Chrome/Edge session. Earlier paragraphs below are historical checkpoints, not claims about the changed current image.
+
+Review loop 1 implementation returned with 512 local checks, 27 actual Chromium checks, 11 supervision checks and four PostgreSQL fault checks passing in controlled development overlays. The automatic 0.7-second deletion recovery produced gain through the normal entry point in 9.42 seconds. Parent full backend before loop 2: 1,100 passed, 117 explicitly gated skips, 217.73 seconds. Immutable image `sha256:0264ab85a2c46bc41444122a363732904e97942d17e165b5bdb78110f56ff285` failed its ordinary deadline cleanup gate and is superseded. These records do not close A4's explicitly unobserved allocation/restart gates or deployed acceptance.
+
+Loop 2 returned with 534 local checks (128 explicit Linux-browser skips), 410 adapter checks, 33 actual Chromium checks and 24 actual supervision checks passing. The late metadata correction passed 56 local checks (107 explicit Chromium skips) and 27 actual Chromium checks. All Linux implementation measurements used read-only development overlays; the final handoff is retained in `../../tmp/retro-review2-results/implementation-handoff.md`. Production candidate `sha256:82c58105d5923fee08c919fdebbe86071a5564ad4b7dd20cb8bd451a8b930782` was built from the stable source without overlays. Parent whole-backend and immutable browser/supervision gates are running; durable database and separate kernel OOM gates follow. No candidate pass or full A4/epic completion is claimed before those results.
+
+### Historical loop 2 immutable checkpoint — 2026-10-04
+
+The whole backend passed 1,131 tests with 143 explicitly gated skips (223.72 s). The immutable image above passed all 194 browser/supervision cases with zero skips, one separate kernel-OOM case deselected (783.83 s), then all 16 selected database browser/ownership/fault cases with zero skips (92.81 s). XML is retained in `../../tmp/retro-final2-results/`. Ordinary infinite-script deadline cleanup, three-platform gain, denied prerequisites, bounded output, direct death chains and automatic delayed cleanup recovered on this candidate. Outer-worker death still leaves an interrupted profile; the test's independent deletion is not production restart reclamation.
+
+A separate read-only probe on the same immutable production code reached isolated DOM collection (650,397 characters), then lowered only the runner address-space limit. First-exception tracing directly observed `MemoryError` at `browser_runner.py:304`, the normal `dom.encode('utf-8')` call; HTTP was unchanged at 9.062 s and a subsequent normal entry gained in 6.631 s. An earlier run observed propagated MemoryError in main and is insufficient by itself to attribute the native phase. This qualifies that induced native encoding failure/caller-preservation path, not isolated-world serialization failure, reparsing allocation, durable completion of that native-path fault or guaranteed shared-cgroup isolation. The separate post-kernel-OOM durable probe passed after correcting its wrong-token test assertion: real memory events increased oom/oom_kill by one at a 1 GiB peak, exact original HTTP completed under the current claim after 6.589 s, and a subsequent normal browser job completed in the same worker after 6.907 s. Owner isolation, distinct claims, immutable replay/original snapshot and clear cleanup slot were checked. Earlier harness failures expected only LeaseLost, but the browser transition correctly rejects a wrong token with ValueError during provenance validation; accepting both existing rejection outcomes fixed the harness without production changes. This is observed recovery, not guaranteed shared-cgroup isolation or completed A4 acceptance.
+
+The third review attempt launched all four lenses together. Initially, the edge-case reviewer stopped with an account usage-limit error before returning findings. The user supplied its replacement report on 2026-10-04; all four reports were then classified in the third-review table above. The same implementer is correcting the verified native-latch, metadata-activity and ruby regressions and adding ancestor-hidden script coverage. Ten first-instance deferrals have been appended once with explicit ticket owners; carried findings have not been duplicated. The changed source requires a new immutable candidate and integration gates before a scoped commit. No acceptance waiver, activation or human-owned Done follows this review.
+
+The separately registered exact-image kernel-OOM test also passed (one passed / 31 deselected, 7.98 s): caller survival, unchanged HTTP, 1 GiB peak and oom/oom_kill each +1. It ran in its own disposable network-none container; this closes the deliberately deselected test from the broad union, without establishing guaranteed worker isolation. All current test/probe processes and review agents have stopped; the task database remains available for resumed integration. No commit or deployment was made.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/a4-browser-supervision-handoff.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/a4-browser-supervision-handoff.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/a4-browser-supervision-handoff.md
@@ -0,0 +1,119 @@
+---
+title: A4 namespace supervision implementation handoff
+date: '2026-10-04'
+ticket_ref: '2.12'
+disposition: implemented-partially-qualified
+---
+
+Production source and all scoped test files are ready for the parent's final
+immutable candidate build. This handoff does not complete A4 or waive the user's
+deployed browser requirement. PUBLIC_BROWSER_FALLBACK remains false by default.
+No commits, cloud operations, database reconfiguration or runner/fallback-file
+edits were performed by A4.
+
+Historical handoff before parent unified review loop 1. The source hashes and
+development measurements below identify that checkpoint. Later cleanup recovery
+corrections and qualification are recorded in `retrospective-action-execution.md`
+and `../../implementation-artifacts/plan-extraction-retrospective-actions.md`.
+
+## Changed paths
+
+- `backend/app/extraction/browser.py`: replaces ancestry enumeration and
+  communicate buffering with a retained namespace-init pidfd, bounded
+  OWNER/READY/ACK protocol, nonblocking request/output receipt, one outer
+  monotonic ten-second deadline and a half-second cleanup reserve. Candidate
+  acceptance requires successful bootstrap exit after namespace exit/profile
+  deletion. Missing prerequisites decline without launching a runner. One
+  attempt lock and one retained cleanup slot prevent accumulating helpers and
+  profiles when cleanup stalls; later attempts decline until cleanup succeeds.
+- `backend/app/extraction/browser_supervisor.py`: stdlib-only, single-threaded
+  bootstrap establishes combined user/PID namespaces and single nonzero ID
+  maps, denies setgroups, drops capabilities, arms parent-death chains and keeps
+  namespace PID 1 behind ACK. Runner lifetime belongs to that namespace. Profile
+  creation runs inside init; deletion runs in bootstrap after namespace exit.
+- `backend/tests/test_browser_supervision.py`: explicit controlled Linux fault
+  gates, synthetic different-session/double-fork/frozen descendants, independently
+  killed init/bootstrap/outer worker, unrelated sentinel, denied prerequisites,
+  stalled setup/deletion/READY/stdout, forbidden worker ancestry inspection,
+  streaming receipt cap, malformed output, bounded cleanup backlog, observed
+  native-main MemoryError and separate kernel OOM probe.
+- `backend/tests/test_postgres_tracer.py`: four opt-in actual namespace-fault
+  cases (allocation refusal, abrupt death, oversized output, stalled deletion)
+  through process_local_once, checking current claim, immutable original HTTP
+  raw/normalized data, ownership, replay and a subsequent job in the same worker.
+  These new database tests are written but were not run by A4; parent owns this
+  shared gate.
+- `.github/workflows/ci.yml`: registers focused supervision alongside the actual
+  browser suite, adds a separate finite disposable OOM container, and applies
+  memory-swap=memory to browser and PostgreSQL browser gates.
+- This handoff document.
+
+## Final source hashes (SHA-256)
+
+| Path | Hash |
+| --- | --- |
+| browser.py | `69b9d419278bfdacf69040f30f1723fc8afa25ecf9995ac2ea08c0c8ec05878b` |
+| browser_supervisor.py | `253691a257a55f88b864f56fa43f3146cdbbbdec5722afcad5190fc1547aa5d7` |
+| test_browser_supervision.py | `3641491141e6824234f609a71dfe6ad9af0bf6e93688611b7328299a62be9722` |
+| test_postgres_tracer.py | `eb17ef0d7ec0e465330306547cd72435306bc598bb00680a1840a850ff38eee2` |
+| ci.yml | `9950cb0b1cd253e21451be26ea1513642c3e6976ea6fe1e056e6bc7a5320741b` |
+
+## Observed development probes
+
+All Docker probes used parent's existing base image
+`sha256:635354824a2dae125b105f4779bcfe46adf523ae89f1797c371a06fc2b4d4f7e`
+with the current backend source mounted read-only over `/app/backend`. They are
+source-overlay development evidence, **not final immutable candidate image or
+deployed acceptance**. Controls: default nonroot UID/GID 10001, --init, network
+none, 0.5 CPUs, memory 1 GiB, memory-swap 1 GiB, shm 256 MiB, existing
+infra/browser-seccomp.json, finite external timeout. No added privileges,
+capabilities, cgroup delegation, sandbox bypass or budget increase.
+
+| Probe/run | Observed result |
+| --- | --- |
+| Focused suite excluding separately selected kernel OOM | 20 passed, 1 deselected; 74.27 s. Later additions are separately covered below; these counts overlap and must not be summed. |
+| Direct init/bootstrap/outer-worker death | 3 passed, 21 deselected; 10.32 s. Init kill caller elapsed 2.679 s; bootstrap kill 2.221 s. Runner, frozen different-session descendant and owner terminate; unrelated sentinel survives. |
+| Final malformed-output/prerequisite plus existing non-actual browser selection tests | 59 passed, 90 deselected; 12.80 s. Includes output code arrays/objects returning INVALID_OUTPUT and receipt bounded to MAX_BYTES+1. |
+| Final denied prerequisites including owner pidfd/signaling, ACK and control-message cap | 10 passed, 20 deselected; 16.48 s. No runner marker or attempt profile remains. |
+| Different-session/double-fork descendant with abrupt runner death | Frozen and unfrozen cases pass; elapsed 1.657 / 1.725 s in corrected suite, owned process gone, sentinel alive. |
+| Independent 12 s profile creation/deletion, READY and stdout stalls | Caller 10.001 / 10.002 / 10.001 / 10.002 s respectively; test tolerance <11 s reflects scheduling only. Deferred cleanup explicitly recorded and completed by bounded subsequent helper drain. Production waiting budget remains ten seconds. |
+| Worker /proc iteration regression | No worker ancestry walk; abrupt failure preserved HTTP, elapsed 1.684 s. Independent helper-side delayed inspection does not become worker cleanup. |
+| Repeated stuck cleanup | One known outstanding directory; three further attempts decline; no additional profile backlog; bounded later cleanup succeeds. |
+| Instrumented actual 384 MiB bytearray under 256 MiB RLIMIT_AS through browser_runner.main | Observed MemoryError marker, RUNTIME_FAILED, original HTTP object unchanged, caller survives; elapsed 2.843 s in corrected suite. This limit is test-only, not applied to production Chromium. |
+| Separate instrumented actual 1,200 MiB touched bytearray in shared 1 GiB cgroup | 1 passed, 20 deselected; 12.25 s suite, caller attempt 10.004 s. memory.peak=1073741824; memory.events oom 0→1, oom_kill 0→1; caller survives and original HTTP unchanged. This is an observed OOM, not a worker-survival guarantee. |
+| Existing actual three-platform sandboxed gain inside additional namespace | 3 passed, 120 deselected; 27.29 s. This was a development overlay run; parent reruns current A1/A2 union against final image. |
+| git diff --check on scoped tracked edits | Passed. |
+| Windows host Python test collection | Could not collect: selectolax absent in host Python. Not a pass; controlled container runs above supplied the dependencies. |
+
+No existing supervision tests were skipped to accommodate the replacement.
+Search found no old _kill_tree/communicate mocks. The replay test's Popen-fails
+guard is still valid because replay must never launch any browser helper.
+Baseline F4/F5 failures remain the independent observations recorded in the
+supporting plan; these were not claimed as newly reproduced in this handoff.
+
+## Qualification still required
+
+| Gate | Current state |
+| --- | --- |
+| G1 prerequisites | Development overlay cases observed; exact final candidate image run remains open. |
+| G2 ownership/death | Runner, init, bootstrap and outer-parent cases observed with independent sentinel/liveness checks. Full launch/execution/cleanup race matrix and exact candidate qualification remain open. |
+| G3 deadline/cleanup | Independent stalls, bounded output and capped backlog observed. Final-image regression and the full near-deadline matrix remain open. |
+| G4 allocation failure | Native-main instrumented MemoryError and kernel OOM observed separately from ordinary Chromium gain. Allocation failure during normal isolated-world DOM serialization and native runner UTF-8 encoding/reparsing is **unobserved/unqualified**. Same-worker post-OOM database completion and actual subsequent browser gain remain open. |
+| G5 durable evidence | New database fault tests unrun by A4; parent runs with current claim/owner/provenance/next-job checks on final image and shared PostgreSQL harness. No DB test or skipped test is claimed as passed here. |
+| G6 preserved security/function | Development overlay three-platform gain observed. Complete current browser security/function union and database gates remain parent-owned and open for final image. |
+
+**Observed worker-death profile risk:** killing the outer worker terminates the
+bootstrap, namespace init, runner and frozen descendant through the tested death
+chain, but leaves its interrupted `/tmp/vct-browser-*` directory. The test records
+this and removes only its known directory with a bounded independent helper.
+The production in-memory cleanup slot cannot survive worker death; persistent
+profile reclamation across worker restarts is not implemented or qualified.
+Ordinary live-worker failure cleanup/backlog bounds do not establish that claim.
+
+**Memory/deployment limits:** namespace ownership does not isolate the worker
+from shared-cgroup OOM victim selection. A surviving caller in one observed OOM
+run is not guaranteed isolation, durable database completion or browser recovery.
+Deployed browser availability, source-session/security prerequisites, complete
+qualification and activation remain required under A3 and the user's retained
+deployed browser requirement. A4 must remain incomplete while its required gates
+are open. Parent owns final image, unified thorough review and completion status.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/a4-browser-supervision-implementation-plan.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/a4-browser-supervision-implementation-plan.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/a4-browser-supervision-implementation-plan.md
@@ -0,0 +1,66 @@
+---
+title: A4 browser supervision implementation recommendation
+ticket_ref: '2.12'
+date: '2026-10-03'
+disposition: proposed-controls-unqualified
+after: [9, 10]
+---
+
+# A4 implementation plan
+
+Parent executes after CSS ticket 2.9 and fetch ticket 2.10. This supporting plan preserves the approved F4–F6 intent; it does not change ticket status, authorize browser activation or establish deployed acceptance. Docker is currently stopped; parent owns restart. No new runtime probes accompanied this plan.
+
+## Intent and boundaries
+
+Qualify abrupt runner death, independent cleanup delay and actual allocation failure, and fix demonstrated failures while retaining useful HTTP evidence. Implement one attempt owner that remains identifiable after runner death and one outer deadline covering setup, execution and cleanup.
+
+Keep supervisor/runner UID/GID nonzero, `chromium_sandbox=True`, the existing seccomp profile, secret-free runner environment, network denial, source CSP, identity/gain checks, access-wall handling and immutable HTTP provenance. Keep deployed `PUBLIC_BROWSER_FALLBACK=False`. No privileged container, added host capabilities, cgroup delegation, seccomp relaxation, supervisor mapping to UID 0, sandbox bypass or increased resource budget. Preserve Chromium's own sandbox internals. Reuse existing DOM/adapters; exclude CSS and fetch/decompression implementation.
+
+## Existing evidence
+
+Cached baseline: `vct-backend:story28`, image `sha256:cb6445e95d789de1f6236dbc95c7b03b4b27baea27bbb547737b48af38a00723`. Both production browser files matched workspace SHA-256 at assessment time; subsequent candidate changes require a new immutable image. Controls: UID 10001, `--init --network none --cpus 0.5 --memory 1g --memory-swap 1g --shm-size 256m`, existing seccomp, finite outer timeouts. Times exclude Docker startup.
+
+| Probe | Observed outcome |
+| --- | --- |
+| Ordinary sandboxed Chromium | Browser gain, 7.904 s. |
+| Abrupt runner death, separate-session synthetic descendant | 0.429 s; descendant survived cleanup with PPID 1. HTTP result unchanged. |
+| Actual Chromium descendants frozen, runner killed | 4.993 s; four descendants remained alive. Gone runner's `pidfd_open` raised EINVAL, aborting cleanup. Narrow rerun located `browser.py:151`. HTTP result unchanged. |
+| Three independent 4 s `/proc` enumeration stalls | 12.059 s against 10 s budget; HTTP unchanged. Controlled delay injection. |
+| Independent 12 s profile-cleanup stall | 12.034 s against 10 s budget; HTTP unchanged. Controlled delay injection. |
+| Instrumented runner: 384 MiB allocation under 256 MiB RLIMIT_AS | Observed MemoryError; native runner main returned RUNTIME_FAILED, caller survived, HTTP unchanged; 2.401 s. |
+| Instrumented runner: 1,200 MiB allocation in shared 1 GiB cgroup | Peak 1,073,741,824 bytes; oom +1, oom_kill +1, runner exit -9; caller survived, HTTP unchanged; 9.162 s. |
+| Actual Chromium touched-buffer pressure | DEADLINE, 9.885 s; no OOM event. Allocation failure unqualified. |
+| Subsequent Chromium attempt in same caller | 9.902 s; no gain. Caller survival observed; browser recovery unqualified. |
+
+Probe-owned survivors were killed through retained pidfds before disposable container exit. These allocation probes exercised an extraction caller, not database-backed worker completion or failure during normal DOM serialization. F4/F5 are demonstrated defects; F6 remains conditional qualification evidence. A shared-cgroup 1 GiB OOM is **not a worker-survival guarantee**.
+
+## Minimum proposed implementation
+
+1. **Trusted bootstrap in a separate process.** Never unshare/fork the threaded HTTP worker. A small single-threaded helper calls `unshare(CLONE_NEWUSER | CLONE_NEWPID)`, establishes single-ID mappings retaining the caller's nonzero UID/GID, writes `setgroups=deny` before an unprivileged GID map where required, and forks the first child as namespace PID 1. Drop bootstrap-only namespace capabilities before processing source input. Do not depend on an unverified `unshare` executable or `--map-root-user`.
+2. **Parent owns the namespace init pidfd before any browser starts.** The trusted bootstrap reports the child's PID as visible in the worker's namespace. Init waits for a bounded READY/ACK handshake; parent opens its pidfd while init is alive and validates readiness/nonroot identity. Only after ACK may init create the profile and spawn the runner. A pidfd for the outer bootstrap alone is insufficient. Handle bootstrap/worker death through a tested parent-death chain and control-channel closure; no browser may escape the handshake. Bound bootstrap termination/reaping too.
+3. **One absolute monotonic deadline.** Keep the 10 s budget, starting before attempt setup. Put profile creation/deletion, runner execution and any `/proc` inspection inside the namespace owner. Reserve cleanup time inside that budget. Parent uses bounded nonblocking IPC and deadline-aware waiting; cap result receipt at MAX_BYTES + 1 and cap control messages separately. Accept a candidate only after bounded protocol validation and successful attempt cleanup/exit. At expiry, signal namespace init SIGKILL through its retained pidfd, close IPC and return the original HTTP result. Namespace init death supplies kernel descendant termination, including other sessions and nested PID namespaces; no outer `/proc` tree walk is needed for ownership.
+4. **Cleanup remains independent of individual errors.** Close every acquired descriptor even if signaling fails. Continue independent termination/reaping after one error; never reopen a gone runner PID as the sole owner or assume every EINVAL is harmless. Track finite cleanup outcomes without exception strings or source material. Successful calls leave no profile. Interrupted deletion uses a separate bounded helper for the known attempt directory; cap outstanding cleanup and decline further browser attempts when cleanup capacity is exhausted. Do not claim immediate deletion during a deliberately stalled filesystem operation.
+5. **Fail closed on missing prerequisites.** Unsupported Linux/PID namespace support, denied unshare or ID mapping, failed pidfd signal/handshake, or incompatible sandbox launch returns RUNTIME_UNAVAILABLE with original HTTP evidence. Post-start failure returns the existing finite RUNTIME_FAILED/DEADLINE outcome with original HTTP evidence. Missing namespace support must never fall back to today's process-group-only implementation. No retries that bypass controls.
+
+Namespace ownership fixes process lifetime, not memory isolation. Keep attempt concurrency bounded and all worker-side IPC allocations bounded. Do not apply the test's 256 MiB RLIMIT_AS blindly to Chromium: virtual-address reservations require separate compatibility qualification. If F6 fails, keep fallback disabled and route the remaining runtime limitation to A3; do not claim that namespace supervision prevents the shared cgroup from selecting the worker as an OOM victim.
+
+## Prerequisite assessment
+
+**Observed:** nonroot Chromium gain with its sandbox enabled; pidfd open/signaling of live probe descendants; seccomp allows `clone`, `unshare`, `setns`, pidfd operations and `prctl`; cgroup memory.max=1 GiB, memory.oom.group=0, cgroup mount not writable.
+
+**Unrun:** combined user+PID unshare; nonzero UID/GID mapping; namespace-init ownership handshake and ancestor pidfd kill; parent-death races; Chromium inside the additional namespace; namespace/profile cleanup under faults.
+
+`mount` is permitted by this seccomp JSON only when the container has CAP_SYS_ADMIN. Use inherited `/proc`; namespace-local process enumeration is not an ownership prerequisite. Prove Chromium compatibility with that proc view. If a private proc mount or extra capability is required, decline the attempt under the existing controls and report the limitation to A3. Static syscall allowlists and prior Chromium success do not prove these prerequisites. References: [user mappings](https://man7.org/linux/man-pages/man7/user_namespaces.7.html), [unshare](https://man7.org/linux/man-pages/man2/unshare.2.html), [namespace-init death](https://man7.org/linux/man-pages/man7/pid_namespaces.7.html), [shared-cgroup OOM](https://docs.kernel.org/admin-guide/cgroup-v2.html).
+
+## Remaining acceptance gates — all unrun on proposed implementation
+
+- **G1 prerequisites:** exact candidate image passes combined unshare, nonzero maps, PID 1 verification, parent pidfd ownership/signaling and nested sandbox launch with inherited `/proc`. Inject each denied prerequisite: no runner launch, no leaked helper/profile, HTTP unchanged, RUNTIME_UNAVAILABLE. No skipped prerequisite test counts as passed.
+- **G2 F4:** kill runner during launch, execution and cleanup, with frozen and unfrozen descendants and another-session/double-fork cases. Kill namespace init directly; exercise bootstrap and outer-parent death/handshake races. Record PID/start time, PPID/PGID, pidfd and exit/reap status. Every owned descendant must terminate; an unrelated sentinel outside the attempt must survive. Verify descriptor closure and bounded reaping.
+- **G3 F5:** independently stall `/proc` iteration/stat, profile creation and deletion, including early runner completion and near-deadline execution; exercise stalled READY/ACK and oversized/stalled stdout. Record setup/execution/termination/profile/total times with an external watchdog. Production cutoff stays 10 s; test assertion may retain the existing <11 s scheduling tolerance, which must not become extra production waiting time. Assert scope termination and bounded leftover-profile handling; repeat attempts cannot create an unlimited cleanup backlog.
+- **G4 F6:** observe actual MemoryError and actual kernel OOM; additionally target normal isolated-world DOM serialization and runner UTF-8 encoding/reparsing. Record failing process, peak/current memory, memory.events deltas, selected result and cleanup. DOM_LIMIT or DEADLINE without observed allocation failure is not covering evidence. Same worker must preserve HTTP fields/hashes, remain alive and process a subsequent job; browser recovery requires an actual subsequent gain. Any worker loss or unobserved targeted failure leaves this gate open.
+- **G5 durable evidence:** parent runs the existing local claim/persistence boundary with fault outcomes and checks completion under the current claim, owner isolation, immutable HTTP raw/normalized provenance and replay; no inappropriate browser provenance. Database checks are separately recorded from network-none browser probes. `vct-retro-postgres` at 127.0.0.1:55439 belongs to parent: never stop/remove/reconfigure it. If the integration harness is unavailable, report this gate unrun.
+- **G6 preserved security/function:** actual three-platform gain, strict no-gain/conflict HTTP preservation, source CSP, access walls without snapshots, secret-free child environment and reachable-loopback HTTP/WebSocket denial. Run affected adapter/replay tests after CSS/fetch integration. Preserve all existing resource/sandbox controls and capture image identity; no network or sandbox bypass to obtain a pass.
+
+Parent owns candidate image creation, scoped finite probes, unified review and evidence recording. Keep cloud/deployed qualification and activation under A3, independently gated even after local acceptance. Source changes are future work in `browser.py`, a small trusted namespace supervisor, and focused fault tests; reuse the runner's evidence/security implementation.
+
+Source of approved intent: [story 2.12](story-qualify-browser-process-cleanup-and-memory-failure-boundarie.md), [retrospective F4–F6/A4](epic-extraction-retrospective.md), [approved action plan](../../implementation-artifacts/plan-extraction-retrospective-actions.md), [runtime decision](browser-runtime-decision.md). Fault locations: `backend/app/extraction/browser.py:129–210`; original allocation boundary in `browser_runner.py`'s isolated-world collection and `main`; existing gates in `backend/tests/test_browser_fallback.py` and `.github/workflows/ci.yml`.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/browser-host-delivery-proposal.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/browser-host-delivery-proposal.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/browser-host-delivery-proposal.md
@@ -0,0 +1,47 @@
+# Compatible browser host delivery proposal — A3 / 2.11
+
+Prepared 2026-10-04. **Proposal only; no provisioning, deployment or activation.** The user retains deployed browser enrichment as required. A4 qualification precedes host approval and release. A Linux VM is a candidate on which the container controls can be configured and measured; compatibility is not established by choosing that host type.
+
+## Proposed delivery
+
+Use one dedicated Linux Docker host in the existing development resource group and VNet for a bounded qualification trial. Keep the web/API/dispatcher, database schema, source admission and user ownership contracts. Run the existing immutable backend image and `python -m backend.worker.main` in finite `WORKER_MODE=job` invocations, with one invocation active at a time. Record the host OS/kernel, Docker version, exact registry digest and container settings before testing.
+
+The proposal requests enough host capacity for Docker plus the unchanged 0.5 CPU / 1 GiB worker container; a planning allowance is 2 vCPU / 4 GiB. This is an estimate, not an approved VM SKU, cost quote or worker-budget increase. Before any paid creation, select the available regional SKU/OS image, obtain its compute/disk/network/logging estimate and a trial spending ceiling, specify the expiry/deallocation owner, and present that concrete infrastructure decision. No new resource is authorized by the earlier acceptance-scope choice.
+
+## Existing and proposed bindings
+
+Read-only Azure network inspection on 2026-10-04 confirmed the existing VNet and its two delegated subnets. No network configuration was changed.
+
+| Binding | Existing value / proposed change |
+| --- | --- |
+| Resource group / region | `VCT_Connect_Service_Bus` / `southeastasia` |
+| VNet | `vct-connect-dev-vnet`, `10.48.0.0/16` |
+| Existing app subnet | `container-apps`, `10.48.0.0/23`, delegated to Container Apps |
+| Existing database subnet | `postgres`, `10.48.2.0/28`, delegated to PostgreSQL |
+| Proposed worker subnet | New nondelegated `browser-workers`, `10.48.3.0/28`; this does not overlap either observed subnet. Recheck availability immediately before provisioning. |
+| Database connectivity | Existing private PostgreSQL FQDN and linked private DNS; TLS and current credentials retrieved through the existing secret mechanism. No public database endpoint. |
+| Queue | Existing `vct-connect-standard` / `vct-analyse`; live queue consumption requires an explicit canary/cutover decision after isolated qualification. |
+| Identity | A dedicated worker managed identity with only required receiver/registry/secret access; verify SDK authentication inside the container before any queue consumer starts. |
+| Container controls | UID/GID10001, Chromium sandbox, current `infra/browser-seccomp.json`, `--init --cpus 0.5 --memory 1g --memory-swap 1g --shm-size 256m`; no privileged mode or added capabilities |
+| Environment | Existing queue/database settings, `API_RUNTIME=worker`, `WORKER_MODE=job`, 780-second processing lease/lock renewal, `PUBLIC_BROWSER_FALLBACK=false` until release gates pass |
+
+PostgreSQL private access supports clients in a different subnet of the same VNet; its delegated database subnet is reserved for PostgreSQL. The new host therefore needs its own subnet and working private DNS. [Microsoft private-network documentation](https://learn.microsoft.com/en-us/azure/postgresql/network/concepts-networking-private).
+
+Service Bus supports managed-identity authentication and queue-scoped receiver authorization. Registry and database-secret access must be checked independently; a receiver role does not provide them. Identity tokens and database credentials belong only to the trusted worker, whose browser child environment remains filtered. [Microsoft identity documentation](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-managed-service-identity).
+
+Docker CPU and memory limits are explicit runtime settings. Setting memory-swap equal to memory denies container swap; it does not isolate the worker from an OOM victim decision within that container. [Docker resource documentation](https://docs.docker.com/engine/containers/resource_constraints/).
+
+## Qualification and release sequence
+
+1. **Local source gate:** finish the unified review and immutable-image browser, namespace/death, deadline, database preservation and separate OOM checks. Keep A4's native DOM/encoding failure, durable post-OOM recovery and restart profile reclamation open until directly qualified. A partial pass does not authorize activation.
+2. **Host decision:** present the exact OS/SKU, cost ceiling, expiry and networking/identity changes. After approval, build the host without weakening seccomp, namespace or Chromium controls. Missing prerequisites return RUNTIME_UNAVAILABLE; do not change host security policy merely to obtain a pass.
+3. **Isolated host qualification:** run the exact image's synthetic three-platform browser and fault tests with `--network none`. Record UID/capabilities, namespace/pidfd prerequisites, descendant/profile outcomes, normalized/raw hashes, access statuses and denied network/storage. No source overlays count as final-image qualification.
+4. **Trusted worker integration:** verify private DNS/TLS/database access, managed identity and actual broker receive/renew/settlement with a controlled qualification message. Require current claim, owner isolation, immutable snapshot/provenance, replay and retained HTTP on browser failure. Synthetic local queue tests alone do not prove the deployed broker boundary. Do not start an uncontrolled second consumer on the live queue.
+5. **Canary decision:** identify the qualification message/source and owner, the exact producer/consumer routing and the stop/drain procedure for the current job. Retain traceable public-source HTTP first, actual justified browser gain and failure preservation on the deployed image. If the source blocks access, record that status and continue to hold gain acceptance open.
+6. **Activation:** only after A4 and exact deployed qualification pass, record release approval and change fallback for the qualified worker. Keep a rollback that stops the candidate consumer, drains active work through existing lease/settlement rules, restores the prior HTTP worker digest/false flag and deallocates trial compute when approved. Preserve completed immutable snapshots.
+
+## Required decision and evidence record
+
+Before provisioning, the host decision must contain the exact VM image/SKU, cost/expiry, subnet/NSG/identity bindings, secret delivery, access method and rollback owner. Before activation, the record must additionally contain the candidate Git revision/registry digest, actual host test results, broker/database canary IDs, and closed A4 prerequisites. These fields are currently unapproved/unqualified; this document prepares the delivery path without claiming it completed.
+
+References: [retained scope decision](browser-runtime-decision.md), [current execution](retrospective-action-execution.md), [A4 handoff and open gates](a4-browser-supervision-handoff.md), [epic completion gate](extraction-completion-gate.md). Repository bindings were checked in `infra/azure/main.bicep`, `backend/app/config.py` and `backend/worker/main.py`.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/browser-runtime-decision.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/browser-runtime-decision.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/browser-runtime-decision.md
@@ -0,0 +1,35 @@
+# Browser runtime decision — ticket 2.11 / A3
+
+Status: delivery scope decided on 2026-10-04; deployed qualification remains open.
+
+## Human decision — 2026-10-04
+
+The user selected: **“Keep deployed browser enrichment required; leave full epic acceptance pending.”** No scoped deferral was accepted. Preserve epic criterion 2 / R4 as declared. Continue compatible-host planning and exact-image local qualification; deployed gain, queue/preservation and activation prerequisites remain required. The current disabled flag stays false until those gates pass. No new paid host or deployment is authorized by this scope decision.
+
+## Observed environment
+
+Read-only Azure inspection on 2026-10-03 found `vct-connect-dev-analysis` on Consumption with 0.5 CPU / 1 GiB, Event trigger and `PUBLIC_BROWSER_FALLBACK=False`. Its backend digest was `sha256:36f806aecb13f9eba21aa9d88f512bf16f369d703482d4b0985bf5b9f9cdda6e`.
+
+The October 2 probe used an earlier image and returned `RUNTIME_UNAVAILABLE` on all three adapters, preserving HTTP evidence. It does not qualify the current image. This code includes both supervision prerequisite failures and sandboxed Chromium launch failures; the historical result cannot identify a particular failed syscall.
+
+Namespace/seccomp incompatibility is a hypothesis: CI explicitly permits the namespace and pidfd operations used by Chromium, while the inspected Azure Container Apps Jobs schemas expose no custom seccomp configuration. Sources: [Playwright Docker guidance](https://playwright.dev/python/docs/docker), [Azure Jobs schema](https://learn.microsoft.com/en-us/azure/templates/microsoft.app/2026-07-01/jobs). No compatible VM or AKS host was found in the approved resource group.
+
+## Concrete qualification path
+
+[The compatible-host delivery proposal](browser-host-delivery-proposal.md) records the observed VNet/subnets, proposed dedicated worker binding, unchanged container controls, identity/database/broker integration and the approval/rollback sequence. It is prepared planning work; its host, cost and deployment qualification remain unapproved.
+
+1. Build an immutable candidate image containing tickets 2.9, 2.10 and the qualified 2.12 changes.
+2. Run Linux Docker with nonroot `vct`, `chromium_sandbox=True`, `--init`, the existing `infra/browser-seccomp.json`, 0.5 CPU, 1 GiB memory, 256 MiB shared memory and `--network none` for synthetic rendering.
+3. Record three-platform gain and HTTP preservation, explicit access walls, denied network, reparented descendants, independent cleanup deadlines and allocation-failure survival. A local pass is local evidence.
+4. Before cloud activation, identify and approve a controlled Linux host that supports these controls. A new paid VM requires a concrete infrastructure decision. Qualify the exact deployed image there, including private database access, broker identity, queue lease/settlement and ownership/provenance.
+5. Enable fallback only after all gates pass and the release decision is recorded. Keep the current deployed flag false meanwhile.
+
+## Alternative considered, not adopted
+
+> Accept deployed HTTP extraction and extension recovery with public browser enrichment explicitly deferred. Keep fallback disabled until the exact-image sandbox, supervisor and deployed gain/preservation gates pass. Local browser success does not count as deployed fallback coverage.
+
+The user did not adopt this scoped deferral. The full epic remains unaccepted until its declared completion gate, including deployed enrichment, passes.
+
+Selected path: retain the full deployed browser requirement and prepare a separate compatible-host delivery plan after local qualification. A new infrastructure/release decision remains necessary before paid resources or activation. No deployment, new resource or runtime flag change was made by this investigation.
+
+References: [epic](epic-extraction.md), [retrospective](epic-extraction-retrospective.md), [historical browser build](story-use-playwright-only-when-public-http-evidence-is-insufficien-plan.md).
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/bug-bound-decoded-public-response-memory-before-allocation-plan.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/bug-bound-decoded-public-response-memory-before-allocation-plan.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/bug-bound-decoded-public-response-memory-before-allocation-plan.md
@@ -0,0 +1,80 @@
+---
+title: 'Bound decoded public response memory before allocation'
+type: 'bugfix'
+ticket: '10'
+created: '2026-10-03'
+status: 'in-progress'
+route: 'full'
+route_source: 'auto'
+review: 'thorough'
+review_source: 'auto'
+lenses_ran: []
+review_loop_iteration: 0
+baseline_revision: '50c9f37df40476c8be22f1a49af745e0a4e120e8'
+context: ['_bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md']
+---
+
+<frozen-after-approval reason="human-owned intent — user authorized applying retrospective proposals">
+
+## Intent
+
+**Problem:** Public response decompression exceeds the byte budget. The recorded retrospective contains a reproducible defect in shared extraction behavior.
+
+**Approach:** Bound streaming decoded output before applying the shared page byte cap.
+
+## Boundaries & Constraints
+
+**Always:** Preserve decoded response-byte hashes, charset handling, bounded retries, redirect safety and deadlines. Cover identity, gzip and deflate encodings, malformed compressed input and incremental output. Unsupported encodings fail explicitly.
+
+**Never:** Change authentication, quotas, schema, source URL admission or deployed browser activation. Do not claim unknown layouts or manual cloud acceptance passed.
+
+## I/O & Edge-Case Matrix
+
+| Scenario | Expected behavior | Failure handling |
+| --- | --- | --- |
+| Reported reproduction | Correct source/access outcome within budget | Explicit status; no fabricated evidence |
+| Valid representative layouts | Preserve audited selected fields and provenance | Missing fields remain unknown |
+| Unsupported or malformed input | Fail with a finite existing outcome | No unsafe fetch or uncaught source exception |
+
+</frozen-after-approval>
+
+## Code Map
+
+- `backend/app/extraction/fetch.py` — shared production boundary.
+- `backend/app/extraction/browser.py` — consumes access classification and preserves HTTP evidence on fallback failure.
+- `backend/tests/test_response_limits.py` — new independent behavioral regressions.
+- `backend/tests/test_extraction.py`, `test_taobao.py`, `test_alibaba.py`, `test_browser_fallback.py` — existing cross-platform source and runtime regressions.
+
+## Tasks & Acceptance
+
+- [x] Correct the shared boundary without altering source binding or existing valid evidence.
+- [x] Add regressions for the recorded failure and adjacent declared rules.
+- [ ] Run affected adapter, merge and replay tests; run actual Chromium where supported.
+- [ ] Review changed behavior and reconcile any confirmed review finding.
+
+**Acceptance Criteria:**
+- Given compressed public HTML, when extraction reads it, then decoding remains within the configured allocation budget on every path. Exceeding capacity terminates extraction with status PARSE_FAILED, reason PAGE_TOO_LARGE and no snapshot. Verification observes decoder output allocations and cumulative chunks; rejection alone cannot pass.
+- Given valid audited pages, when the shared correction is used by all adapters, then status, selected fields and raw hashes remain correct.
+- Given invalid inputs, when extraction stops, then the result is explicit and no inappropriate supplier snapshot is produced.
+
+## Implementation Notes
+
+The user authorized the six proposals and their execution on 2026-10-03. This plan narrows one independent fix from that accepted scope. Existing unrelated initiative/demo edits are preserved; work is on codex/extraction-retrospective-actions. Subagents are authorized by the build workflow; exact code write scopes are disjoint.
+
+Implementation handoff: edit the scoped fetch source and response-limit tests directly in the shared workspace, report every changed path, and do not commit. Other retrospective ticket/document work may appear concurrently; preserve it. Capture baseline-failing regressions in an isolated temporary baseline module/checkout, never resetting this checkout. Verify MockTransport pre-read response compatibility as well as production raw streaming. Observe bounded decoder output allocations, not only the final rejection code.
+
+The parent has already initialized bmad-build and read its rendered workflow. This is the explicit step-03 implementation handoff, not a fresh skill invocation. Do not render or restart the workflow; read this plan and its context and implement. The parent owns planning, ticket coordination, review and completion.
+
+## Plan Change Log
+
+- 2026-10-03: Independent pre-execution validation tightened the acceptance wording to require bounded allocation on failure as well as success. This clarifies the approved A2 scope; rejection after an oversized allocation is insufficient.
+
+## Review Triage Log
+
+Parent unified loop 1 verified B1/E3: a valid raw-deflate stream can start with a plausible zlib header and be falsely rejected. The non-frozen format decision is being re-derived with bounded initial replay, preserving all decoded allocation, malformed-input, provenance and retry gates. Full evidence and KEEP instructions are in `../../implementation-artifacts/plan-extraction-retrospective-actions.md`; the final candidate is not qualified yet.
+
+## Verification
+
+Run the new regression module and affected adapter/replay/merge suites. Record real Chromium and disposable-database gates separately from skipped platform-only cases. No automatic release or full epic acceptance follows a passing local suite.
+
+Implementation checkpoint: 775 passed / 76 gated browser cases skipped in affected adapters, browser policy, merge/replay/parity. New module: 103 cases; six allocation regressions fail against isolated baseline, observing up to 32 MB output allocation. Retained content is capped at 2,000,000 bytes; a separately bounded one-byte overflow detector distinguishes exact capacity from larger pages, is never retained or parsed, and makes cumulative decoder output at most 2,000,001 bytes. Already pre-read client responses were decoded before this boundary and cannot have those external allocations prevented here; production uses raw streaming. Parent owns actual candidate/browser/database gates and the unified action-set review.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/bug-bound-decoded-public-response-memory-before-allocation.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/bug-bound-decoded-public-response-memory-before-allocation.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/bug-bound-decoded-public-response-memory-before-allocation.md
@@ -0,0 +1,42 @@
+---
+id: 10
+type: bug
+title: "Bound decoded public response memory before allocation"
+parent: epic-extraction
+covers: [R4]
+after: [8]
+refined: true
+hitl: false
+risk: medium
+severity: P2
+---
+
+# Bound decoded public response memory before allocation
+
+## Description
+
+Public response decompression exceeds the byte budget. The result must match screen-visible source evidence and the documented resource budget.
+
+## Reproduction
+
+A 2,942-byte gzip body yields a 3,000,000-byte first decoded chunk before the 2 MB application guard. Follow the finite reproduction recorded in the retrospective Behavior verification section.
+
+## Cause Hypothesis
+
+Automatic content decoding produces its output before the application can enforce capacity.
+
+## Acceptance Criteria
+
+1. Given compressed public HTML, when extraction reads it, then decoding remains within the configured allocation budget on every path. Exceeding capacity terminates extraction with status PARSE_FAILED, reason PAGE_TOO_LARGE and no snapshot. Verification observes decoder output allocations and cumulative chunks; rejection alone cannot pass.
+2. Given existing valid platform fixtures, when extraction and replay checks run, then supported evidence, source identities and provenance remain correct.
+3. Given the reported reproduction, when the completed regression runs, then it fails against the recorded baseline and passes against the correction; if the report does not reproduce, record proof that no change is needed.
+
+## References
+
+- parent - _bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md, R4.
+- retrospective - _bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction-retrospective.md, A2 and Behavior verification.
+
+## Notes
+
+- Decision: 2026-10-03 - user approved applying the proposal and proceeding with implementation.
+- Risk: medium because shared extraction behavior can regress across platforms.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/bug-classify-access-walls-using-effective-screen-visibility-plan.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/bug-classify-access-walls-using-effective-screen-visibility-plan.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/bug-classify-access-walls-using-effective-screen-visibility-plan.md
@@ -0,0 +1,79 @@
+---
+title: 'Classify access walls using effective screen visibility'
+type: 'bugfix'
+ticket: '9'
+created: '2026-10-03'
+status: 'in-progress'
+route: 'full'
+route_source: 'auto'
+review: 'thorough'
+review_source: 'auto'
+lenses_ran: []
+review_loop_iteration: 0
+baseline_revision: '50c9f37df40476c8be22f1a49af745e0a4e120e8'
+context: ['_bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md']
+---
+
+<frozen-after-approval reason="human-owned intent — user authorized applying retrospective proposals">
+
+## Intent
+
+**Problem:** CSS visibility misclassifies access walls. The recorded retrospective contains a reproducible defect in shared extraction behavior.
+
+**Approach:** Use the shared static visibility boundary to resolve effective display, inherited visibility and opacity for supported screen styles.
+
+## Boundaries & Constraints
+
+**Always:** Preserve inline versus stylesheet priority, important priority, selector specificity, display subtree suppression and visibility inheritance. Do not execute source scripts or fetch external CSS. Existing identity, access precedence, layouts and provenance remain valid.
+
+**Never:** Change authentication, quotas, schema, source URL admission or deployed browser activation. Do not claim unknown layouts or manual cloud acceptance passed.
+
+## I/O & Edge-Case Matrix
+
+| Scenario | Expected behavior | Failure handling |
+| --- | --- | --- |
+| Reported reproduction | Correct source/access outcome within budget | Explicit status; no fabricated evidence |
+| Valid representative layouts | Preserve audited selected fields and provenance | Missing fields remain unknown |
+| Unsupported or malformed input | Fail with a finite existing outcome | No unsafe fetch or uncaught source exception |
+
+</frozen-after-approval>
+
+## Code Map
+
+- `backend/app/extraction/dom.py` — shared production boundary.
+- `backend/app/extraction/browser.py` — consumes access classification and preserves HTTP evidence on fallback failure.
+- `backend/app/extraction/browser_runner.py` — isolated computed-style collection must preserve descendants that explicitly override inherited visibility; verify the shared correction also survives actual rendering.
+- `backend/tests/test_dom_visibility.py` — new independent behavioral regressions.
+- `backend/tests/test_extraction.py`, `test_taobao.py`, `test_alibaba.py`, `test_browser_fallback.py` — existing cross-platform source and runtime regressions.
+
+## Tasks & Acceptance
+
+- [x] Correct the shared boundary without altering source binding or existing valid evidence.
+- [x] Add regressions for the recorded failure and adjacent declared rules.
+- [ ] Run affected adapter, merge and replay tests; run actual Chromium where supported.
+- [ ] Review changed behavior and reconcile any confirmed review finding.
+
+**Acceptance Criteria:**
+- Given supported HTML with cascaded styles, when extraction classifies it, then visible login/CAPTCHA text stays visible and invisible text supplies neither a barrier nor selected evidence.
+- Given valid audited pages, when the shared correction is used by all adapters, then status, selected fields and raw hashes remain correct.
+- Given invalid inputs, when extraction stops, then the result is explicit and no inappropriate supplier snapshot is produced.
+
+## Implementation Notes
+
+The user authorized the six proposals and their execution on 2026-10-03. This plan narrows one independent fix from that accepted scope. Existing unrelated initiative/demo edits are preserved; work is on codex/extraction-retrospective-actions. Subagents are authorized by the build workflow; exact code write scopes are disjoint.
+
+Implementation handoff: edit the scoped source/tests directly in the shared workspace, report every changed path, and do not commit. Other retrospective ticket/document work may appear concurrently; preserve it. Capture baseline-failing regressions by loading baseline source into a temporary isolated checkout/module, never resetting this checkout. Avoid a bespoke full CSS parser: keep the declared supported static boundary small, or use maintained parser dependencies with appropriate tests if needed.
+
+The parent has already initialized bmad-build and read its rendered workflow. This is the explicit step-03 implementation handoff, not a fresh skill invocation. Do not render or restart the workflow; read this plan and its context and implement. The parent owns planning, ticket coordination, review and completion.
+
+## Plan Change Log
+
+## Review Triage Log
+
+Parent unified loop 1 found direct regressions B4/B5/B6 and E1/E2, collector policy gap B8, and heading consumer gap V1. Re-derivation and per-finding evidence are recorded in `../../implementation-artifacts/plan-extraction-retrospective-actions.md`. Existing tests/security/provenance remain KEEP material; the final candidate is not qualified yet. Pre-existing unsupported selector/Unicode and transient mutation boundaries remain separate.
+
+## Verification
+
+Run the new regression module and affected adapter/replay/merge suites. Record real Chromium and disposable-database gates separately from skipped platform-only cases. No automatic release or full epic acceptance follows a passing local suite.
+
+Implementation checkpoint: 152 passed / 76 gated real-browser cases skipped in the final scoped visibility/browser run. Parent adapter/parity/merge/replay union: 724 passed. Baseline isolated visibility regression: 61 failed / 38 passed, including all five reported cases. Actual browser changes (45 added cases) await the parent candidate image gate; no browser qualification is claimed by skipped tests. Full action-set review is owned by `../../implementation-artifacts/plan-extraction-retrospective-actions.md`.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/bug-classify-access-walls-using-effective-screen-visibility.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/bug-classify-access-walls-using-effective-screen-visibility.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/bug-classify-access-walls-using-effective-screen-visibility.md
@@ -0,0 +1,42 @@
+---
+id: 9
+type: bug
+title: "Classify access walls using effective screen visibility"
+parent: epic-extraction
+covers: [R4]
+after: [8]
+refined: true
+hitl: false
+risk: medium
+severity: P2
+---
+
+# Classify access walls using effective screen visibility
+
+## Description
+
+CSS visibility misclassifies access walls. The result must match screen-visible source evidence and the documented resource budget.
+
+## Reproduction
+
+The five CSS wrappers in the retrospective yield four missing AUTH_REQUIRED statuses and one false AUTH_REQUIRED status. Follow the finite reproduction recorded in the retrospective Behavior verification section.
+
+## Cause Hypothesis
+
+Static hiding rules are applied before resolving the effective screen declaration and inherited visibility.
+
+## Acceptance Criteria
+
+1. Given supported HTML with cascaded styles, when extraction classifies it, then visible login/CAPTCHA text stays visible and invisible text supplies neither a barrier nor selected evidence.
+2. Given existing valid platform fixtures, when extraction and replay checks run, then supported evidence, source identities and provenance remain correct.
+3. Given the reported reproduction, when the completed regression runs, then it fails against the recorded baseline and passes against the correction; if the report does not reproduce, record proof that no change is needed.
+
+## References
+
+- parent - _bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md, R4.
+- retrospective - _bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction-retrospective.md, A1 and Behavior verification.
+
+## Notes
+
+- Decision: 2026-10-03 - user approved applying the proposal and proceeding with implementation.
+- Risk: medium because shared extraction behavior can regress across platforms.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction-retrospective.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction-retrospective.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction-retrospective.md
@@ -0,0 +1,176 @@
+---
+epic: epic-extraction
+date: 2026-10-03
+verdict: rejected
+criteria: declared
+headless: false
+---
+
+# Extraction epic retrospective
+
+Completed evidence review of the extraction implementation through `50c9f37`. Machine verdict: **rejected** for full epic acceptance, with six proposed action items. The deployed three-platform path works; confirmed access-classification defects remain unresolved. Existing approvals to release individual stories and defer manual/runtime work are preserved; they do not explicitly accept the full epic against every declared criterion.
+
+## Epic summary
+
+Selected epic: `epic-extraction` (initiative epic 2). Ticket status check: 2.1–2.5 are built/review; 2.6–2.8 are done/done. No unfinished tickets (`pending_tickets: []`). Built tickets remain subject to human closure.
+
+The user reported no particular concern to weight. The declared R4 criteria govern this assessment.
+
+| Ticket | Build order and status | Plan baseline → next baseline |
+| --- | --- | --- |
+| 2.1 | 1688 contract/extraction; built/review | `a0265a1..e3c5a4a` |
+| 2.2 | Failure classification/retries; built/review | `e3c5a4a..499d255` |
+| 2.3 | Taobao adapter; built/review | `499d255..e452afd` |
+| 2.4 | Alibaba adapter; built/review | `e452afd..374dfc8` |
+| 2.5 | Public browser fallback; built/review | `374dfc8..1d31eac` |
+| 2.6 | Extension merge; done/done | `1d31eac..51810d1` |
+| 2.7 | Layout verification/raw replay; done/done | `51810d1..90bead7` |
+| 2.8 | Shared helper refactor; done/done | `90bead7..50c9f37` |
+
+Baselines are recorded in the corresponding eight `story-*-plan.md` frontmatters; each ancestor relationship was checked. The final endpoint is inferred from HEAD `50c9f37df40476c8be22f1a49af745e0a4e120e8`, the extraction release closeout. No later implementation commit was found. Ranges 2.1 and 2.3 also include explicitly recorded saved-page/extension recovery follow-ups. Range attribution does not imply those follow-ups were part of the original frozen ticket intent.
+
+Inventory: epic file and parent initiative R4 read; all eight `tickets.py find` entries resolved; all eight plans available, including triage, verification, change logs and the dated 2.3 follow-up review. Every `story_file` is null. Additional evidence includes the Taobao/Alibaba sample audits, recovery plans, tracked deferred-work record, sanitized fixtures, source and tests, three merge commits, and local sanitized deployed outcome/image-probe records. The configured `planning-artifacts` folder is absent, so PRD/architecture comparison is limited to the epic, initiative and existing code conventions. No previous foundation retrospective exists. No conversation transcripts were loaded; process analysis is limited to explicit plan/build records, without inferring why undocumented session decisions occurred.
+
+The required `git_evidence.py` pre-pass failed with Git dubious-ownership errors under both sandbox and approved execution. It intentionally removes `GIT_*` environment overrides. No Git configuration was changed. Deterministic fallback used native Git with a command-scoped safe.directory for this exact repository: commit ranges, ancestor checks, non-merge numstat aggregation and final diff. The union contains 27 commits, including three merges (`c7ef8c5`, `0cba680`, `b0eec86`); final net diff: 98 files, 21,527 insertions and 839 deletions. Non-merge volume is kept separate from final net differences and merge changes. Binary-revision completeness from the failed helper is unavailable.
+
+The bmad-review input is the staged unified diff at `C:/Users/eidel/AppData/Local/Temp/vct-extraction-retro-bgdeovpq.diff` (temporary review input; source of record is the Git range above). Review lenses are adversarial, edge-case-hunter and verification-gap. Subagent tooling is unavailable; the lenses run sequentially with scope focused on transport, access classification, shared DOM/coverage helpers, extension merge, replay, API/worker wiring and release verification. No exhaustive claim is made for every line of the 98-file diff or unseen source layouts.
+
+## Findings
+
+### Aggregate views
+
+**Architecture delta and duplication.** The epic adds 15 extraction modules. The AST-derived relative-import graph has no cycle in that package. Shared transport is in `fetch.py`; JSON/scalar readers in `evidence.py`; DOM/access mechanics in `dom.py`; coverage/status assembly in `contracts.py`. The three adapters call the shared fetch path, and the worker dispatches by canonical platform (`backend/worker/main.py:33`). Replay still imports platform-specific binding/selection helpers from Taobao and Alibaba; this is explicit reuse of their audited contracts, not an independently demonstrated layering defect (`backend/app/extraction/renormalize.py`, imports and `renormalize_public_fields:447`). This analysis covers imports in the extraction package and changed API/storage/worker entry points; it is not a repository-wide dependency audit.
+
+**Size and churn.** Non-merge added/deleted/net lines: `offer1688.py` 670/404/+266; `alibaba.py` 567/38/+529; `taobao.py` 483/118/+365; `renormalize.py` 518/12/+506; `storage.py` 388/136/+252. Current sizes are respectively 266, 529, 365, 506 and 822 lines; storage started at 570. The largest added artifact is the 6,163-line test baseline, followed by dependency-lock churn. These measurements identify maintenance surfaces, not god classes: adapters own their layouts, replay owns retained-field validation, and storage owns transactions. No size-based defect is asserted. Merge first-parent deltas were inspected separately: 2.6 9 files/+538/−2, 2.7 11 files/+1,312/−15, 2.8 19 files/+6,919/−267; these are not added to non-merge churn. Sources: the eight ranges above, especially `eefbfe0`, and AST/line-count measurements in this run.
+
+**Pattern divergence retained intentionally.** HTTP/replay coverage treats None, empty strings and empty lists as absent; extension coverage preserves the legacy non-None predicate; browser gain additionally excludes empty dictionaries (`backend/app/extraction/contracts.py:25`, `:30`; `browser.py:41`). The refactor names those policies instead of silently changing outcomes. Disposition: **accept as-is** for compatibility, with no upstream change proposed in this retrospective. Coverage is a field-presence measure, not proof of evidence quality. Sources: `story-refactor-sweep-plan.md:140`; `backend/tests/test_extension_merge.py:62`; `test_refactor_parity.py:198`. The fresh selected tests pass.
+
+**Verified wins.** Shared status/provenance survives the deployed queue; unauthorized capture/import and foreign guest polling are rejected. Merge has explicit same-source checks and immutable baseline provenance (`extension_merge.py:71`; `storage.py:484`), with repeated-capture bounds and source-label tests (`test_extension_merge.py:103`, `:129`, `:148`). Replay rejects incompatible revisions/nested fields, preserves source capture metadata and states `retained_public_fields_only` (`renormalize.py:447`; `test_renormalize.py:40`, `:51`, `:181`). The 41-case parity fixture has case-set and LF/CRLF assertions (`test_refactor_parity.py:154`, `:167`, `:175`), avoiding silent loss of a golden case. Original complete HTML is not retained; replay cannot recover fields missed by an earlier selector. This is an explicit accepted scope limit, not a missing full-page archive requirement.
+
+### Consolidated findings and routing
+
+Each finding has an instance disposition and a prevention lesson. Findings F4–F6 establish missing qualification evidence, **not** a demonstrated orphan, deadline overrun or worker OOM. Their existing deferrals are preserved.
+
+| ID | Evidence and implication | Instance disposition | Prevention |
+| --- | --- | --- | --- |
+| F1 | Five shared CSS visibility defects remain across adapter/access-wall consumers. Overridden stylesheet hiding, `display:none;display:block`, visible descendants of visibility-hidden parents, and print-only styles each make `browser.access_wall` return None for screen-visible `Please sign in`. Stylesheet `opacity:0%` instead returns AUTH_REQUIRED for invisible text. All five were reproduced in this run. Sources: `backend/app/extraction/dom.py:59`, `:83`, `:90`; `browser.py:100`; `story-refactor-sweep-plan.md:93`–`:99`; `../../implementation-artifacts/deferred-work.md:87`–`:101`. These defects existed before 2.8, but were introduced during this epic and survive its refactor. They can suppress real access barriers or introduce false ones. | **fix now**, A1; blocks full acceptance of criterion 2. No claim of credential bypass or observed external-source exploitation. | A6: epic acceptance must examine surviving defects across ticket baselines; parity with a defective earlier ticket is insufficient. |
+| F2 | The shared fetcher calls HTTPX `iter_bytes()` before checking the 2 MB capacity. A 2,942-byte gzip response yielded one 3,000,000-byte decoded chunk in this run. The cap rejects accumulated data after decompression allocation. Sources: `backend/app/extraction/fetch.py:220`–`:230`; 2.2 plan Review Triage Log, Blind 9; `../../implementation-artifacts/deferred-work.md:64`. No compressed-response allocation regression was found by the scoped source/test search. | **fix now**, A2. The reproduced defect concerns allocation timing, not successful persistence of an oversized page. | A6: resource gates must observe allocation boundaries, not only final rejection codes. |
+| F3 | Browser enrichment is inactive in the Azure worker. The recorded deployed probe returned RUNTIME_UNAVAILABLE for all platforms, preserving HTTP fields; latest release retains `PUBLIC_BROWSER_FALLBACK=False`. Sources: 2.5 plan Release Closeout at `:127`; 2.8 plan `:153`; `backend/app/config.py:34`; `backend/worker/main.py:40`; `infra/azure/main.bicep:12`. Local Chromium success does not establish deployed enrichment. | **defer**, consistent with the recorded runtime decision; A3 proposes a compatible runtime or an explicit epic-scope reconciliation. Disablement is not itself a new defect, and this finding alone does not force rejection. | Resolve runtime availability before claiming deployed fallback coverage; scope changes require a human decision. |
+| F4 | Abrupt runner death/reparenting remains unqualified. Existing actual cleanup test exercises an infinite script, an approximately 2 MB DOM and a conflicting field; it does not forcibly kill the runner before descendant discovery. Sources: `backend/app/extraction/browser.py:132`; `backend/tests/test_browser_fallback.py:290`–`:321`; 2.5 triage B5. Repo source/test search for kill_tree/reparent/forced termination found no covering fault-injection test. | **defer**, A4 before browser activation; orphan survival remains an open hypothesis. | Test the process-lifetime boundary using actual descendants, rather than treating normal cleanup as proof for abrupt parent death. |
+| F5 | Cleanup reserves 0.5 seconds, while process enumeration and temporary-profile deletion lack an independent wall-clock guard. The existing normal-resource cleanup assertion is under 11 seconds; no slow-profile/proc-state fault was found in the searched tests. Sources: `browser.py:132`, `:188`–`:214`; `test_browser_fallback.py:297`; 2.5 triage B6. | **defer**, A4; no over-budget cleanup was observed in this retrospective. | Qualify cleanup separately from source execution and define the supervisor's enforcement boundary. |
+| F6 | DOM serialization/allocation precedes output-size rejection. The 1 GiB container gate and 2,000,001-character test verify one bounded case, not worker behavior under memory exhaustion. Sources: `backend/app/extraction/browser_runner.py:196`–`:211`; `.github/workflows/ci.yml:59`; `test_browser_fallback.py:293`; 2.5 triage B7. No OOM qualification test was found by the scoped search. | **defer**, A4; worker-loss/OOM remains unproven. | Observe which process fails and whether original HTTP evidence survives an allocation failure before activation. |
+| F7 | Current merged extension behavior has strong deterministic/owner-store checks but no recorded completed signed-in network inspection on the latest released build. Earlier 1688 capture and Taobao item capture/import were accepted; live Taobao shop capture was explicitly deferred. Sources: 2.8 plan `:156`; recovery plan User browser capture, saved-product and Shop HTML checkpoints; `frontend/apps/extension/src/capture.test.ts:20`, `:134` (simulated DOM); `test_extension_merge.py:20`, `:103` (merge/provenance assertions). These checks do not establish the current Chrome-to-deployed-merge journey or its actual wire payload. | **defer**, preserving the user's earlier manual deferral; A5. This is a verification limit, not a claim that credentials are transmitted. | Distinguish source DOM selection, signed-in wire payload and persisted merge assertions in release evidence. |
+
+### Review-lens record
+
+The adversarial pass identified eleven concrete improvements/qualification gaps: the five F1 cases separately, F2, F3, F4, F5, F6 and F7. The edge-case pass independently retained the five F1 branches and F2's decoded-chunk boundary. The verification-gap pass retained the F2 resource-verification boundary, F4–F6 unqualified runtime faults and F7 current-client release boundary. Overlap is preserved below; the consolidated table above deduplicates remediation.
+
+No additional proven ownership, deduplication or replay regression survived the scoped inspection and fresh targeted verification. Handled paths were dropped: extra/secret-shaped capture keys, mismatched page identity, foreign owners, duplicate-only merges, source revisions, raw nested-field selection, ordinary redirect/deadline failures and failed-source outcomes have explicit guards/assertions. This does not assert exhaustive verification of unseen platform layouts.
+
+Canonical review findings (no severity/ranking; lens overlaps are intentional):
+
+```json
+[
+  {"lens":"adversarial","location":"backend/app/extraction/dom.py:90","trigger_condition":"Overridden stylesheet hiding suppresses a visible access wall","guard_snippet":"Resolve effective cascade and important priority before pruning","potential_consequence":"A visible login wall is omitted from classification"},
+  {"lens":"adversarial","location":"backend/app/extraction/dom.py:59","trigger_condition":"Inline display:none followed by display:block remains classified as hidden","guard_snippet":"Resolve effective inline display declaration","potential_consequence":"A visible login wall is omitted from classification"},
+  {"lens":"adversarial","location":"backend/app/extraction/dom.py:83","trigger_condition":"Pruning a visibility-hidden ancestor also removes its visible descendant","guard_snippet":"Preserve explicitly visible descendants","potential_consequence":"A visible login wall is omitted from classification"},
+  {"lens":"adversarial","location":"backend/app/extraction/dom.py:90","trigger_condition":"Print-only stylesheet hiding is applied to screen content","guard_snippet":"Respect stylesheet media applicability","potential_consequence":"A screen-visible login wall is omitted from classification"},
+  {"lens":"adversarial","location":"backend/app/extraction/dom.py:109","trigger_condition":"Stylesheet opacity:0% is not treated as invisible","guard_snippet":"Handle percentage-zero opacity consistently","potential_consequence":"Invisible text produces a false access failure"},
+  {"lens":"adversarial","location":"backend/app/extraction/fetch.py:220","trigger_condition":"Automatic decompression allocates a chunk beyond the page limit","guard_snippet":"Bound decoded output before allocation crosses the budget","potential_consequence":"Compressed content exceeds the intended memory bound"},
+  {"lens":"adversarial","location":"story-use-playwright-only-when-public-http-evidence-is-insufficien-plan.md:127","trigger_condition":"Deployed runtime cannot execute browser enrichment","guard_snippet":"Qualify a compatible supervised runtime or reconcile epic scope","potential_consequence":"Local browser gains do not reach deployed users"},
+  {"lens":"adversarial","location":"backend/app/extraction/browser.py:132","trigger_condition":"Abrupt runner death has no recorded descendant qualification","guard_snippet":"Force runner termination and observe descendant cleanup","potential_consequence":"An orphan-process risk remains unqualified"},
+  {"lens":"adversarial","location":"backend/app/extraction/browser.py:188","trigger_condition":"Slow cleanup has no independent wall-clock qualification","guard_snippet":"Measure cleanup faults and enforce the supervisor boundary","potential_consequence":"The total browser deadline remains unqualified under cleanup faults"},
+  {"lens":"adversarial","location":"backend/app/extraction/browser_runner.py:196","trigger_condition":"Allocation-failure worker survival has no recorded qualification","guard_snippet":"Observe bounded memory pressure and preservation of HTTP evidence","potential_consequence":"The worker-loss hypothesis remains unresolved"},
+  {"lens":"adversarial","location":"story-refactor-sweep-plan.md:156","trigger_condition":"Latest merged release lacks completed signed-in extension network acceptance","guard_snippet":"Inspect selected wire payload and persisted same-owner merge","potential_consequence":"Current client-to-deployed-merge compatibility remains unverified"},
+  {"lens":"edge-case-hunter","location":"backend/app/extraction/dom.py:90","trigger_condition":"Stylesheet display hiding is subsequently overridden","guard_snippet":"resolve_effective_cascade_before_pruning()","potential_consequence":"Visible access wall is removed"},
+  {"lens":"edge-case-hunter","location":"backend/app/extraction/dom.py:59","trigger_condition":"Inline display:none is subsequently overridden","guard_snippet":"resolve_effective_inline_display()","potential_consequence":"Visible access wall is removed"},
+  {"lens":"edge-case-hunter","location":"backend/app/extraction/dom.py:83","trigger_condition":"Hidden ancestor contains an explicitly visible descendant","guard_snippet":"preserve_visible_descendants()","potential_consequence":"Visible access wall is removed"},
+  {"lens":"edge-case-hunter","location":"backend/app/extraction/dom.py:90","trigger_condition":"Hiding stylesheet applies only to print media","guard_snippet":"if not applies_to_screen(style): continue","potential_consequence":"Screen-visible access wall is removed"},
+  {"lens":"edge-case-hunter","location":"backend/app/extraction/dom.py:109","trigger_condition":"Stylesheet opacity is zero percent","guard_snippet":"normalize_opacity_percentage_before_comparison()","potential_consequence":"Invisible text creates a false access wall"},
+  {"lens":"edge-case-hunter","location":"backend/app/extraction/fetch.py:220","trigger_condition":"One compressed response expands beyond the decoded byte budget","guard_snippet":"decode_with_remaining_output_limit()","potential_consequence":"Allocation exceeds the intended cap before rejection"},
+  {"lens":"verification-gap","location":"backend/app/extraction/fetch.py:220","trigger_condition":"Size rejection checks do not observe decompression allocation","guard_snippet":"Assert bounded decoded chunk allocation from compressed input","potential_consequence":"Post-allocation rejection stays green despite excess allocation","gap_shape":"regression-gap","consumer":"shared bounded_extract used by all three adapters","evidence":"Read the shared fetch path; scoped repo gzip/decompress searches found no regression; fresh 2942-byte gzip produced a 3000000-byte chunk"},
+  {"lens":"verification-gap","location":"backend/app/extraction/browser.py:132","trigger_condition":"Existing cleanup test does not inject abrupt runner death","guard_snippet":"Force parent death before discovery and assert no surviving descendants","potential_consequence":"Normal cleanup passes without qualifying reparented descendants","gap_shape":"regression-gap","consumer":"render_cached process supervision","evidence":"test_browser_fallback.py:290-321 covers infinite script, DOM limit and conflict, not forced runner termination; scoped source/test search found no such case"},
+  {"lens":"verification-gap","location":"backend/app/extraction/browser.py:188","trigger_condition":"Existing deadline assertion does not inject slow cleanup","guard_snippet":"Observe supervisor deadline under slow profile/proc cleanup","potential_consequence":"Normal cleanup passes without qualifying total-budget faults","gap_shape":"regression-gap","consumer":"render_cached cleanup boundary","evidence":"Read test_browser_fallback.py:297 and browser.py cleanup; scoped slow-cleanup/profile search found no fault-injection case"},
+  {"lens":"verification-gap","location":"backend/app/extraction/browser_runner.py:196","trigger_condition":"DOM-limit test does not observe allocation-failure worker survival","guard_snippet":"Verify original HTTP evidence survives an observed allocation failure","potential_consequence":"Output rejection passes while worker-loss risk stays unqualified","gap_shape":"regression-gap","consumer":"browser_runner DOM serialization and worker result retention","evidence":"test_browser_fallback.py:293 allocates 2000001 characters; CI caps container at 1 GiB; scoped OOM/allocation search found no qualification test"},
+  {"lens":"verification-gap","location":"frontend/apps/extension/src/capture.ts:44","trigger_condition":"Latest signed-in wire-to-deployed-merge acceptance remains deferred","guard_snippet":"Inspect selected JSON transmission and owner-scoped merged snapshot","potential_consequence":"Synthetic DOM and merge tests cannot establish current Chrome deployment compatibility","gap_shape":"regression-gap","consumer":"Chrome Capture this page to deployed capture endpoint","evidence":"Read simulated-DOM capture.test.ts:20/134 and merge/provenance assertions at test_extension_merge.py:20/103; latest release plan:156 explicitly leaves signed-in network acceptance open"}
+]
+```
+
+## Behavior verification
+
+### Fresh deployed exercise in this retrospective
+
+Executed three bounded guest submissions against the existing development web deployment, followed by owner polling and a separate guest's polling attempt. The actual API, queue, worker and persistence path ran; this is distinct from deterministic tests. Results from this run:
+
+| Platform | Analysis ID | Owner poll / completed result | Snapshot | Foreign poll |
+| --- | --- | --- | --- | --- |
+| 1688 | `b33ab75e-125e-4f34-a76e-3c044175d088` | 200; COMPLETED; BLOCKED / ACCESS_CHALLENGE; 1 attempt; PUBLIC_HTTP | absent | 404 |
+| Taobao | `1a43fcce-bffa-46ef-8de0-b9f9a0f8bd5b` | 200; COMPLETED; BLOCKED / ACCESS_CHALLENGE; 1 attempt; PUBLIC_HTTP | absent | 404 |
+| Alibaba | `9ce396d2-80b3-462e-90c7-2f8d5d3ca5d4` | 200; COMPLETED; PARTIAL; 1 attempt; PUBLIC_HTTP | present | 404 |
+
+URLs: the representative 1688 offer `996518024136`, Taobao item `1076425861755`, and Alibaba product `1600147809763` named in the sample audits and latest release smoke. Unauthenticated capture and import each returned 401. Only status/provenance/count metadata was printed; credential or source-session material was not logged. The observed Alibaba PARTIAL result differs from the earlier BLOCKED outcome recorded in `tmp/story28-deployed-outcomes.json`; source access varies. The fresh observation is the current evidence, and neither result supports a guaranteed future accessibility claim. Exact field coverage and independent audit of the fresh Alibaba values were not performed.
+
+These checks created three normal guest analysis records in the development service. No deployment or service configuration was changed. A rendered client click-through, signed-in capture, wire-payload inspection and actual Chromium execution were not performed in this run.
+
+### Fresh deterministic checks and reproductions
+
+Command: `.venv/Scripts/python.exe -m pytest backend/tests/test_refactor_parity.py backend/tests/test_extension_merge.py backend/tests/test_renormalize.py -q -p no:cacheprovider`, with bytecode writing disabled. **215 passed in 3.05 seconds.** This covers the recorded outcome cases, selected-text/secret guards, merge bounds/provenance and raw replay validation. It does not replace a database-backed merge exercise or actual Chromium qualification; prior release evidence records those separately.
+
+Direct F1 reproduction called `backend.app.extraction.browser.access_wall` with an ordinary Product title and `Please sign in` body content in these five wrappers:
+
+| Wrapper | Expected screen classification | Observed |
+| --- | --- | --- |
+| `.wall{display:none}.wall{display:block}` with `.wall` div | AUTH_REQUIRED | None |
+| div `style="display:none;display:block"` | AUTH_REQUIRED | None |
+| `visibility:hidden` div with `visibility:visible` child | AUTH_REQUIRED | None |
+| `style media="print"` hiding `.wall` div | AUTH_REQUIRED | None |
+| stylesheet `.wall{opacity:0%}` | None | AUTH_REQUIRED |
+
+F2 reproduction: `compressed = gzip.compress(b'A' * 3000000)`; `httpx.Response(200, headers={'content-encoding':'gzip'}, stream=httpx.ByteStream(compressed))`; `len(next(response.iter_bytes()))`. Observed 2,942 compressed bytes and a 3,000,000-byte first decoded chunk, versus `MAX_HTML_BYTES=2_000_000`. This is a safe, finite local reproduction of allocation preceding the application's size guard.
+
+### Existing evidence, explicitly reported rather than rerun here
+
+Latest release plan `story-refactor-sweep-plan.md:138`–`:155` records final backend 850 passed/32 skipped, actual browser union of 78 passing cases after isolated retries, 12 actual Chromium queue cases, successful PR/main CI and development deployment, and an 82-test probe in the deployed image. The local `tmp/story28-image-probe-results.json` independently contains `82 passed in 0.65s` and `VCT_STORY28_PROBE result=0`. The release logs distinguish 31 browser cases run separately and the opt-in Azure Service Bus skip. Existing browser deadline flakes under concurrent load are disclosed in the plan; no claim of a fresh full-suite or Chromium pass is made here. Hosted run links were read from the release records; remote CI histories were not re-fetched.
+
+The Taobao recovery plan records real user item capture (4/12 fields/four reviews), saved item import (6/12/two reviews), and saved shop import (4/12/20 products), with source-byte hashes; live shop extension capture remains explicitly deferred. The 1688 extension plan records the earlier accepted signed-in capture at 25% coverage and a subsequently added auto-open flow without a separately observed final Chrome run. These are existing acceptance records, not observations made in this retrospective.
+
+## Previous-retro follow-through
+
+The preceding epic in `tickets.py status` order is `epic-platform-foundation`. Its expected `epic-platform-foundation-retrospective.md` is absent from the inventoried folder. There is no previous retrospective action section to audit; this is missing historical evidence, not evidence of no outstanding foundation work. The separate deferred-work file was inspected for extraction follow-ups and provides the F2–F7 sources above.
+
+## Action items
+
+At the original assessment, all six items were **proposed**, with role owners because the epic/tickets contain no named assignee. The user subsequently approved applying them and proceeding on 2026-10-03. They are now tracked as tickets 2.9–2.14; see the [current execution record](retrospective-action-execution.md) for fixes, measurements, supporting checks and remaining human/runtime prerequisites. This dated assessment preserves its original evidence and acceptance verdict.
+
+| ID | Proposed action and observable completion | Owner | Routing |
+| --- | --- | --- | --- |
+| A1 | Correct shared effective visibility for the five F1 cases, preserving valid platform layouts. Add regression assertions for screen-visible access walls and invisible text at helper and affected adapter/fallback boundaries; verify actual access status and absence of inappropriate snapshots. | Extraction developer; QA reviewer | fix now; F1 |
+| A2 | Bound decompression output before oversized decoded allocation; preserve response-byte/provenance policy, finite retries and the 2 MB retained-body limit. Verify compressed input, repeated chunks, terminal rejection and preservation of worker results. | Backend transport developer | fix now; F2 |
+| A3 | Propose and qualify a compatible supervised Chromium runtime before enabling fallback, with an exact-image deployed gain/preservation probe; alternatively submit an explicit human-approved reconciliation of the full epic's fallback scope. Preserve the current disabled setting until qualification. | Platform architect and product owner | deferred remediation or proposed spec reconciliation; F3 |
+| A4 | Before browser activation, qualify abrupt runner death, slow cleanup and allocation failure under the existing resource/sandbox limits. Observe descendants, supervisor deadline, worker survival and retained HTTP evidence; convert demonstrated defects into normal development fixes. | Runtime engineer and QA reviewer | deferred qualification; F4–F6; not three presumed bugs |
+| A5 | When the user's source session is available, resume latest-release signed-in extension acceptance: selected-only network JSON, owner-scoped merge/deduplication/provenance, result opening and live Taobao shop capture. Preserve prior item/import acceptances and the explicit manual deferral. | QA/release reviewer, coordinating with the user's source session | deferred operational check; F7 |
+| A6 | Propose an epic completion gate that checks unresolved defects across ticket baselines, deployed capability versus local gates, and allocation boundaries; consolidate superseded extraction follow-ups with evidence rather than relying on built/done labels alone. The deferred-work extension-build item is superseded by the implemented capture/merge path, while runtime/manual/resource items remain open. | Engineering lead / ticket owner | process proposal; F1–F3 and inventory evidence |
+
+A1 and A2 address confirmed defects. A3–A5 retain known deferrals and do not authorize runtime activation or require the user to perform manual checks during this run. A6 is motivated by concrete records: the same five CSS defects were deferred as pre-refactor behavior in 2.8 despite being part of this epic's final access classifier; `deferred-work.md:49` still proposes extension construction even though `storage.py:484` and the 2.6 done plan demonstrate it landed. No undocumented session root cause is inferred.
+
+## Acceptance verdict
+
+**rejected** — criteria **declared**. This is the machine assessment of the full epic; no human full-epic acceptance override has been supplied. It is **not accepted** under the current criteria while F1 remains unresolved. Ticket completeness does not force this verdict: `pending_tickets` is empty, and built tickets count as finished in this workflow.
+
+| Declared Done when criterion (`epic-extraction.md:26`–`:31`) | Assessment |
+| --- | --- |
+| 1. Representative URLs from all platforms yield a snapshot or correct explicit status in the deployed path. | Demonstrated for the bounded representative forms: fresh 1688/Taobao blocked completions and Alibaba PARTIAL snapshot, with one attempt and ownership checks. This is conditional support, not universal page-family or live-success coverage. |
+| 2. HTTP first; bounded justified fallback; auth/CAPTCHA/block directs to extension. | **Not fully met.** HTTP-first dispatch, eligibility, failure guidance and local fallback checks exist, but F1 demonstrably suppresses screen-visible login barriers in the shared classifier and invents a barrier for invisible text. F2 also leaves the shared fetch allocation bound incomplete. Browser enrichment is intentionally disabled in the deployed runtime; this is a separately tracked approved limitation, not silently counted as deployed fallback success. |
+| 3. Raw/normalized snapshots retain provenance, missing fields, coverage and extractor version for replay/audit. | Demonstrated on the audited retained-field contract by replay/parity checks, existing persisted HTTP/browser tests and deployed snapshot behavior. Replay is limited to retained public fields; it cannot reconstruct omitted HTML. No fresh independent field-value audit of the Alibaba snapshot was performed. |
+| 4. Extension merge avoids duplicate evidence and platform credentials/session state. | Backend schema/secret rejection, merge/provenance and ownership evidence support the implemented boundary; 215 fresh selected tests pass. Current signed-in wire/network acceptance remains a recorded limitation; prior accepted capture/import records are preserved. No credential leakage is established. |
+
+The 2.5 inactive-runtime approval, 2.3 shop-capture deferral and 2.8 release acceptance do not expressly waive the epic's access-classification criterion. This document therefore does not infer such a waiver. A human may override the machine verdict; record that explicitly in a follow-up retrospective rather than changing statuses implicitly. Completing A1/A2 and resolving the named scope/verification limits supplies evidence for reassessment, not an automatic promise of acceptance.
+
+## Open questions
+
+1. Should full epic acceptance require a compatible deployed browser-gain path, or should that capability receive an explicit scoped deferral? The existing story runtime decision permits disablement, while the epic still names justified Playwright fallback. A3 proposes resolving that distinction; no scope edit was made.
+2. Do forced runner death, slow cleanup or allocation failure produce a real orphan, budget overrun or worker loss? F4–F6 are unqualified paths; existing ordinary-limit tests do not answer these specific questions.
+3. When an accessible signed-in shop is available, does the current deployed extension/merge flow pass the selected-payload, owner-result and auto-open checks? The earlier manual deferral remains in force.
+4. Will the fresh Alibaba public success reproduce with similarly traceable field values across additional audited pages? This run establishes one PARTIAL deployed snapshot, not a platform-wide accessibility rate.
+
+The user supplied no additional going-in concern. Team discussion was not requested and was skipped. At the original retrospective assessment, this document was the only authored project artifact; source code, plans, story/epic files and ticket statuses had not been edited. The renderer snapshot, temporary review diff/test files and three ordinary development guest submissions are operational artifacts/effects described above. Subsequent authorized remediation is recorded separately in the linked execution record.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/extension-acceptance-checklist.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/extension-acceptance-checklist.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/extension-acceptance-checklist.md
@@ -0,0 +1,32 @@
+# Signed-in extension acceptance — ticket 2.13 / A5
+
+Status: automated checks can run; live acceptance awaits a connected source session.
+
+On 2026-10-03 the browser inventory exposed only empty Codex in-app and MCP Apps browser surfaces. No Chrome/Edge source session was connected. The earlier accepted 1688 capture and Taobao item/import checks remain historical evidence; they do not establish latest-release live shop capture or result opening.
+
+## Required live journey
+
+Use the installed candidate extension and the deployed development web/backend release. Record extension version/build revision, backend image digest, date and platform/page family. The user signs in through their normal source session; a login or CAPTCHA is an access outcome, never a passed capture.
+
+1. Open an accessible canonical 1688 offer or Taobao item and invoke **Capture this page**. Inspect the actual request to the capture endpoint: only supported source identity and selected bounded fields are in its JSON. Platform cookies, passwords, session tokens, full HTML and arbitrary page globals must be absent. VCT authorization belongs in the request header, not the source payload. Record field names, byte count and status only; do not save credentials or an unredacted HAR.
+2. Poll the created analysis with its owner. Verify the persisted source identity, extension method/mode, capture hash/version, missing fields, completeness and merge provenance. Repeat equivalent evidence and inspect deduplication; a different owner must receive 404 and no snapshot data.
+3. Confirm automatic result opening lands on that analysis. Reopen the popup and recover the existing result after a failed lookup. Record observed destinations/outcomes, not merely Chrome API invocation.
+4. Repeat for an accessible live Taobao shop/category page with the audited product shelf. Verify selected visible product URLs/titles and shop identity against the page. A saved shop import or synthetic DOM test does not cover this row.
+5. Record pass/fail/access-blocked for each row with sanitized metadata. A missing source session stays pending. Preserve prior accepted item/import evidence and the user's earlier manual deferral.
+
+## Automated supporting gates
+
+### Existing coverage and loading questions owned by 2.13
+
+During the permitted representative live captures above, record source loading state, selected field names, missing fields and completeness. The prior 25% 1688 observation does not qualify current company/activity/rating/review/delivery/transaction coverage. Observe whether a still-loading sparse capture consumes quota; retain that as an open policy/coverage outcome rather than changing quota or treating unknown fields as verified. Record the evidence gaps for planned 2.16's separate API eligibility/field comparison. Source access is required for these observations; no automated fixture claims them passed.
+
+### Available automated checks
+
+- Extension selected DOM, byte bounds and result-navigation tests: `npm test --prefix frontend`.
+- Client/extension types: `npm run typecheck --prefix frontend`.
+- Backend selected schema, secret rejection and deduplication: `backend/tests/test_extension_merge.py`.
+- Database-backed owner-scoped capture/merge/replay: relevant extension cases in `backend/tests/test_postgres_tracer.py` with a disposable PostgreSQL database.
+
+These checks support implementation readiness. They do not mark the live journey complete.
+
+References: [retrospective A5](epic-extraction-retrospective.md), [extension build](story-accept-and-merge-extension-evidence-safely-plan.md), [Taobao audit](taobao-sample-audit.md).
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/extraction-completion-gate.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/extraction-completion-gate.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/extraction-completion-gate.md
@@ -0,0 +1,55 @@
+# Extraction completion gate — ticket 2.14 / A6
+
+Applied on 2026-10-03. This checklist governs reassessment of the full epic. The original retrospective remains a dated baseline, with the current execution record maintained separately.
+
+## Gate rules
+
+1. Identify the candidate full Git revision and deployed backend image digest. Label local, container, database, CI, deployed and live-browser evidence separately. Earlier-image checks cannot qualify a changed image.
+2. Walk every original and follow-up ticket, including issues carried forward from earlier baselines. A finding's age or a built/done label does not remove it from the epic's declared criteria.
+3. For each confirmed defect, require a baseline-failing regression, a candidate pass at the actual consumer boundary and preservation of valid three-platform evidence/provenance. Audit allocation during decompression and DOM collection, not only rejection after allocation.
+4. For runtime hypotheses, record an actual fault probe, environment/resource controls, elapsed time, descendant/profile outcome and retained HTTP evidence. Distinguish a demonstrated defect, a qualified path and an untested path. Skipped tests do not satisfy a row.
+5. For each declared criterion below, cite current evidence and state pass, fail, pending or explicitly deferred. A scope deferral needs the product owner's decision and preserves its outstanding activation/manual gates. Only that decision can change the declared acceptance scope.
+6. Reconcile duplicate/superseded entries in `implementation-artifacts/deferred-work.md`. Give each surviving extraction concern one follow-up ticket, without deleting its historical source. Resolve it only after its observable verification passes.
+7. Reject full acceptance while a criterion has an unresolved defect, an unqualified required capability or a pending required live check. Record any human acceptance override explicitly. Build completion and epic acceptance are separate states.
+
+## Criterion evidence table
+
+| Declared criterion | Required evidence | Current baseline |
+| --- | --- | --- |
+| 1. Three-platform deployed result or correct explicit status | Candidate deployed queue completion, owner poll, foreign-owner denial, truthful snapshot/status | Historical retrospective probe demonstrates bounded representative forms; candidate deployment pending |
+| 2. HTTP first; bounded justified browser fallback; access guidance | A1/A2 regression and adapter gates; A4 fault qualification; A3 exact-image deployed browser qualification | Current immutable candidate passes 339 browser/supervision, sixteen database fault and one kernel-OOM cases; narrow durable encoding/reparse/OOM recovery passes. Full review and remaining A4 paths pending; deployed enrichment remains required and disabled |
+| 3. Versioned raw/normalized provenance and replay | Candidate parity/replay and persisted ownership/immutable provenance checks | Current source backend passes 1,225 cases; exact-image database and three durable recovery probes preserve owner/current-claim/replay/immutable HTTP provenance. Final unified review and deployed criterion evidence remain pending |
+| 4. Credential-free deduplicated extension merge | Candidate schema/merge/database checks plus A5 latest-release selected wire payload, result opening and live shop capture | Prior item/import acceptance retained; current live session unavailable |
+
+## Action inventory
+
+| Action | Ticket | Completion evidence / remaining prerequisite |
+| --- | --- | --- |
+| A1 effective screen visibility | 2.9 | Five reproductions, priority/inheritance/media/opacity boundaries and valid adapters |
+| A2 bounded decompression | 2.10 | Observed output allocation bound, supported compression/hash and malformed-input gates |
+| A4 cleanup/allocation qualification | 2.12 | Actual forced death, slow cleanup and allocation failure; preserve HTTP and worker |
+| A3 deployed runtime reconciliation | 2.11 | [Recorded runtime decision](browser-runtime-decision.md); user retained deployed enrichment required on 2026-10-04; exact-image deployed qualification remains |
+| A5 signed-in extension acceptance | 2.13 | [Concrete acceptance checklist](extension-acceptance-checklist.md); connected accessible source session |
+| A6 completion process | 2.14 | This gate, mapped follow-ups and superseded inventory; reassessment retains unresolved rows |
+
+## Surviving concern ownership
+
+| Concern group | One current follow-up owner | State / verification boundary |
+| --- | --- | --- |
+| Original five visibility defects | 2.9 | Implemented, final review and corrected candidate integration pending |
+| Decoded allocation, valid compression/provenance | 2.10 | Implemented, final review/candidate integration pending |
+| Runner/namespace death, deadlines, output, allocation, restart profiles | 2.12 | Required qualification remains in progress; measured pass and unobserved path are recorded separately |
+| Attribute-only transient walls and line/block-separated access phrases | 2.12 | Existing browser/security qualification concerns remain open; no duplicate closure inferred |
+| Unsupported/pseudo selector lists, Unicode/escapes, all shorthand, hidden/ARIA convention, restored structural shelves, CSS work | planned 2.15 | Refine boundaries and observe consumer/work outcomes before implementation; unsupported is not resolved |
+| Exact-image deployed browser gain/preservation and accessible live-source queue evidence | 2.11 | Host/release decision and actual deployed qualification pending |
+| Selected wire privacy, merge/deduplication, popup recovery, result opening, live shop capture, loading/representative field coverage | 2.13 | Available automated support recorded; connected live source session pending |
+| Prior official 1688 API eligibility/permitted field assessment | planned 2.16 | Human developer-portal access and a separate future decision; no API implementation or scope waiver |
+| Prior extension construction | historical 2.6 / resolved | Source evidence retained; latest-release/live acceptance belongs to 2.13 |
+
+The additional planned entries record existing concerns for A6; they do not broaden the six current implementation actions or close their evidence gates. The one-owner inventory preserves original deferred entries and source findings.
+
+## Reassessment record
+
+Full-epic acceptance: **pending remediation / rejected at the retrospective baseline**. No automatic acceptance is implied by applying proposals, finishing a local fix or passing an automated suite. Record candidate results and review decisions in [action execution](retrospective-action-execution.md).
+
+References: [epic criteria](epic-extraction.md), [retrospective findings and baseline evidence](epic-extraction-retrospective.md), [ticket breakdown](tickets.toml).
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/retrospective-action-execution.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/retrospective-action-execution.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/retrospective-action-execution.md
@@ -0,0 +1,105 @@
+# Retrospective action execution
+
+User authorization: 2026-10-03, “apply the proposals, then proceed with the action items.” No additional concerns were supplied. Original evidence and verdict remain in [the dated retrospective](epic-extraction-retrospective.md).
+
+Branch: `codex/extraction-retrospective-actions`. Baseline: `50c9f37df40476c8be22f1a49af745e0a4e120e8`. Existing initiative/development-pipeline demo edits were present before this work and are preserved.
+
+## Applied proposals
+
+Six follow-ups are in [tickets.toml](tickets.toml): A1→2.9, A2→2.10, A3→2.11, A4→2.12, A5→2.13, A6→2.14. Qualification 2.12 precedes runtime decision 2.11. The historical refactor remains completed; new remediation does not rewrite that release's records.
+
+## Execution state
+
+| Action | State | Evidence / next step |
+| --- | --- | --- |
+| A1 | Review loop 3 correction in progress | Prior CSS/native-latch corrections preserved; current metadata activity needs bounded precompilation state for stylesheet-only reveal |
+| A2 | Implemented; unified verification pending | Bounded decoding and ambiguous raw-deflate fallback corrected; production-default encoding negotiation regression added in loop 2 |
+| A4 | Supervisor remediation under qualification | Loop 2 closes measured pre-arm death race and ordinary deadline cleanup; final image/durable gates and required allocation/restart qualifications remain |
+| A3 | Scope retained; deployed delivery pending | User explicitly kept deployed enrichment required on 2026-10-04; compatible-host delivery and exact-image deployed qualification remain |
+| A5 | Automated support passed; live prerequisite pending | [Acceptance checklist](extension-acceptance-checklist.md); no connected Chrome/Edge session |
+| A6 | Applied; independent inventory audit passed | [Completion gate](extraction-completion-gate.md); sixteen entries, no cycle/drift/unpinned dependency, one owner per concern; source/candidate checkpoint pending |
+
+## Verification ledger
+
+- Baseline deterministic support: `test_refactor_parity.py`, `test_extension_merge.py`, `test_renormalize.py`: **215 passed**, 2.60 seconds; bytecode/cache writes disabled.
+- Frontend candidate supporting checks: `npm test --prefix frontend`: **72 passed, 0 skipped**. `npm run typecheck --prefix frontend`: **passed**. These include selected DOM capture, byte bounds, secret-free simulated source access, navigation/recovery wiring and proxies. They do not establish live Chrome capture or deployed signed-in acceptance.
+- Read-only cloud runtime investigation: current development analysis worker is Consumption 0.5 CPU / 1 GiB, fallback false; backend digest recorded in the runtime decision. No cloud resource, deployment or activation change made.
+- Browser inventory rechecked on 2026-10-04: only empty in-app/MCP Apps surfaces, no connected Chrome/Edge source session. Live source acceptance stays pending.
+- Disposable PostgreSQL supporting acceptance: `test_postgres_tracer.py -k 'extension_capture or taobao_user_evidence'`: **6 passed**, 63 deselected, 21.08 seconds. Covers persisted owner-scoped extension/merged Taobao evidence, replay, quota and secret rejection. Authentication uses the test verifier; this is not a real signed-in browser observation.
+- CSS integration checkpoint: visibility, extraction, Taobao, Alibaba, parity, extension merge and renormalize suites: **724 passed**, 8.27 seconds. The new visibility suite independently failed at the full baseline (61 failed / 38 passed, including all five recorded reproductions). Browser-specific additions were still in progress at this checkpoint.
+- Decompression checkpoint: affected adapter/browser-policy/merge/replay/parity union **775 passed / 76 gated browser cases skipped**. The six independent allocation regressions fail on the baseline, observing up to 32 MB from compressed input and cumulative overflow across fragments. Production now reads raw bytes and bounds each zlib output to at most 64 KiB and the remaining configured decoded budget. Retained page bytes stay at 2,000,000; `MAX_DECODED_BYTES=2,000,001` includes one unretained overflow sentinel. The sentinel is never hashed, parsed or persisted. Pre-read responses were already decoded externally; this boundary checks their existing bytes but cannot undo those earlier external allocations.
+- CSS actual checkpoint image `sha256:635354824a2dae125b105f4779bcfe46adf523ae89f1797c371a06fc2b4d4f7e`: **44/45 new actual cases passed** (78 deselected), 288.67 seconds. The 1688 restored-descendant case returned preserved HTTP instead of gain. One isolated diagnostic reproduced DEADLINE at 9,783 ms; this is under active correction and is not marked passed. The image intentionally uses baseline fetch; it is a CSS checkpoint, not the final integrated candidate.
+- Full CSS/fetch integration checkpoint with disposable PostgreSQL: **1,058 passed / 77 skipped**, 227.90 seconds. Skips are 76 explicitly gated actual Chromium cases plus one opt-in live Azure Service Bus case. This is before final namespace supervisor integration; its focused tests and exact candidate container/worker gates remain separate.
+- A1 deadline correction: phase probes located the repeated 1688 failure before CSS collection, during driver/browser/context startup. A fresh temporary-profile context now starts with its blank page in one launch operation. Under unchanged controls, **38 covering actual Chromium cases passed**, 286.51 seconds; restored descendants gained evidence across all three platforms in 7.42–7.78 seconds. These used read-only runner/test overlays on the CSS checkpoint image and do not qualify the final integrated supervisor image. Local visibility/browser modules: **152 passed / 76 gated skips**. Security, CSP, tampering, storage denial and finite failure cleanup cases were included in the actual selection.
+- 2026-10-04 source-session inventory still exposed only empty in-app/MCP Apps browser surfaces. No connected Chrome/Edge source session was available; A5 live rows remain pending.
+- Integrated backend checkpoint with PostgreSQL after supervisor integration: **1,059 passed / 104 skipped**, 235.04 seconds. These skip counts reflect that run's collection, including actual browser/supervision/DB faults and live Service Bus; the final added protocol cases are covered separately in the immutable image.
+- Prereview production image identifier: `sha256:895e867d94708db997f41afdf6ddba1b59f2fb24f6819005bfd4c4cffecea263`. Source hashes inside that image matched the original A4 handoff; UID 10001. It is superseded by the review correction below.
+- First exact-image browser/worker qualification failed: broad browser run interrupted for diagnosis after **59 failed / 84 passed / 1 deselected**, 166.59 seconds. The first gain attempt reached DEADLINE, then pending cleanup repeatedly returned RUNTIME_UNAVAILABLE at about 501 ms. Concurrent database browser selection: **6 failed / 10 passed**, 78.05 seconds, including five gain cases and the allocation-refusal marker. These failures remain unresolved and are not acceptance passes.
+- Isolated exact-image three-platform gain diagnostic: **3 passed**, 22.19 seconds; gains at 7,878 / 6,787 / 6,799 ms. This narrows the integration failure to deadline/cleanup recovery behavior and does not replace the failed union.
+- Exact-image separate OOM probe: **1 passed**, 9.59 seconds; caller attempt 8.489 seconds; peak 1,073,741,824 bytes, oom/oom_kill each 0→1, caller survives with unchanged HTTP. Durable post-OOM completion and normal DOM/encoding allocation failure remain unqualified.
+
+## A4 measured baseline qualification
+
+Independent fault probes used immutable cached image `sha256:cb6445e95d789de1f6236dbc95c7b03b4b27baea27bbb547737b48af38a00723`, UID 10001, existing seccomp, Chromium sandbox, network none, 0.5 CPU / 1 GiB RAM, no swap, 256 MiB shared memory and finite outer timeouts. Production browser source hashes matched the baseline workspace when measured. This is local baseline evidence, not qualification of the corrected candidate or deployed runtime.
+
+| Probe | Observation | Disposition |
+| --- | --- | --- |
+| Ordinary Chromium control | Gain, 7.904 seconds | One ordinary control passed |
+| Runner killed; descendant used separate session | 0.429 seconds; descendant alive under PID 1 | F4 demonstrated defect |
+| Actual Chromium runner killed after freezing descendants | 4.993 seconds; four live stopped descendants; cleanup pidfd open raised EINVAL | F4 demonstrated defect; probe-owned survivors subsequently killed via retained pidfds |
+| Independent `/proc` stall, three times 4 seconds | 12.059 seconds | F5 demonstrated deadline defect under controlled injection |
+| Independent profile deletion stall, 12 seconds | 12.034 seconds | F5 demonstrated deadline defect under controlled injection |
+| Runner allocation refusal: 384 MiB under 256 MiB RLIMIT_AS | Observed MemoryError, RUNTIME_FAILED, caller survived, same HTTP result; 2.401 seconds | Positive refusal/preservation evidence; no durable worker completion tested |
+| Runner allocation: 1,200 MiB under container limit | Peak 1,073,741,824 bytes, oom/oom_kill each +1, runner −9, caller survived and preserved HTTP; 9.162 seconds | One OOM victim observation; shared cgroup does not guarantee future worker survival |
+| Chromium touched-buffer pressure | DEADLINE, 9.885 seconds, no OOM event | Actual serialization allocation failure not qualified |
+| Next browser attempt in same caller | 9.902 seconds, no gain | Caller alive; browser recovery not established |
+
+Required candidate acceptance remains: attempt ownership independent of reparenting, bounded cleanup/profile operations, observed DOM/runner allocation refusal through durable queue completion, no surviving descendants and successful next-job progress. Do not label DOM_LIMIT or a timeout as an observed allocation failure.
+
+## Local runtime recovery
+
+Docker Desktop restart failed on inaccessible AF_UNIX runtime sockets, first `Docker/run/dockerInference`, then `docker-secrets-engine/engine.sock`. Both directories were inspected and contained only zero-byte runtime endpoints. The failed Docker application/backend processes were stopped and those directories reversibly renamed to `.retrospective-recovery-20261003` backups; no images, volumes or settings were reset. This follows the matching [reported workaround](https://github.com/docker/desktop-feedback/issues/554). Candidate container gates await successful startup; the backups remain preserved outside the repository.
+
+The failed sequential restart recreated a socket directory, so both endpoints were preserved together in additional `.retrospective-recovery-20261003-second` backups before a clean startup. Docker then started successfully and the task-created PostgreSQL container was resumed. No backup deletion was attempted. A bounded baseline-image prerequisite probe confirmed combined user+PID unshare, nonzero single-ID UID/GID maps, namespace PID1 at UID/GID10001 and termination through an outer retained pidfd under the existing sandbox/resource controls. Nested Chromium compatibility remains a separate candidate gate.
+
+## Acceptance
+
+Unified review loop 2 confirmed a new pre-arm parent-death race: delaying init's arming by 0.3 seconds and killing bootstrap after its gate write still launched the runner (1.598 s caller failure, original HTTP preserved). Actual transient CAPTCHA probes also showed current guard gain versus baseline guard BLOCKED for 5,000 collapsible spaces and source-mutated Array.includes. The parent archived fifteen task-owned code/CI/dependency paths in `tmp/retro-review2-keep`, reverted those paths only, amended the non-frozen protocol plan, and re-engaged implementation through a context-free handoff. Existing user/demo edits and all project records remain preserved. All nineteen loop 2 findings/verdicts/routes are recorded in the action plan; lower patches are included in this correction. No final candidate is accepted yet.
+
+A3 preparation now includes [a dedicated host delivery proposal](browser-host-delivery-proposal.md), based on the read-only current VNet inspection and existing worker bindings. It specifies a separate candidate subnet, identity/private database/broker qualification, unchanged limits, approval inputs and rollback. No host, queue, role assignment, network setting, deployed image or runtime flag was changed.
+
+Corrected immutable image `0264ab85…` broad browser/supervision gate stopped at **105 passed / one failed**, zero skips, 325.56 seconds. Failure: the ordinary infinite-script DEADLINE case retained its attempt profile at return. Isolated rerun reproduced the same assertion (**one failed / 128 deselected**, 10.91 seconds; wrapper elapsed 10,002 ms and original HTTP retained). Remaining cases were not run after fail-fast. This is an unresolved candidate cleanup failure, not an acceptance pass; diagnosis and unified review continue. XML is retained locally in `tmp/retro-final-results/browser.xml` and `deadline.xml`.
+
+Review loop 1 re-derivation returned with **512 local / 27 actual Chromium / 11 supervision / four PostgreSQL fault checks passed**, zero skips in those selections. These used controlled development overlays. Recovery after a finite 0.7-second profile deletion gained browser evidence through the normal entry point in 9.42 seconds, with original HTTP provenance retained and no private cleanup intervention. Parent whole backend before loop 2 with disposable PostgreSQL: **1,100 passed / 117 explicitly gated skips**, 217.73 seconds. Immutable production candidate before loop 2: `sha256:0264ab85a2c46bc41444122a363732904e97942d17e165b5bdb78110f56ff285`; its failed integrated gate is recorded above. Loop 2 requires a new final browser/supervision union, durable database faults and separate kernel OOM gate. A4's normal DOM/encoding allocation, durable post-OOM recovery and worker-death profile reclamation remain open.
+
+Unified review loop 1 classified every finding in `../../implementation-artifacts/plan-extraction-retrospective-actions.md`. Its ambiguous raw-deflate fallback and collector annotation decisions were re-derived, along with author-origin revert, hidden URL/password consumers, document-root visibility, native numeric tampering and heading/recovery consumer tests. Loop 2 follows the later integrated deadline failure and independent review findings. Neither superseded candidate is accepted as a final image.
+
+A focused exact-image recovery probe independently showed a finite 0.7-second cleanup killed by the 0.5-second window on three consecutive normal attempts, each declining with the same pending slot. A plain deadline followed by a healthy next attempt can recover (one diagnostic gain at 7.515 seconds), so this is a bounded-window starvation defect under slow cleanup rather than universal runtime incompatibility. Qualification will run sequentially after correction to avoid introducing cross-container resource contention into the gain measurement.
+
+Full epic remains unaccepted while the [completion gate](extraction-completion-gate.md) has unresolved required rows. No source-session result, deployed browser gain or resource-failure qualification is inferred from the automated checks above.
+
+## Latest candidate checkpoint — 2026-10-04
+
+Immutable production image `sha256:82c58105d5923fee08c919fdebbe86071a5564ad4b7dd20cb8bd451a8b930782`, without source overlays: whole backend **1,131 passed / 143 explicitly gated skips** (223.72 s); actual browser/supervision **194 passed / zero skips / one separate OOM case deselected** (783.83 s); actual database browser/ownership/fault selection **16 passed / zero skips / 57 deselected** (92.81 s). These supersede the failed prior-image cleanup qualification; original failed measurements remain above as history. Controls remain nonroot UID10001, sandbox, existing seccomp, 0.5 CPU, 1 GiB/no swap, 256 MiB shared memory. Browser union used network none; database qualification used the disposable task database.
+
+Direct first-exception tracing on this image observed native UTF-8 encoding MemoryError at `browser_runner.py:304` after real isolated collection returned 650,397 characters. The test lowered only runner address space after collection. Original HTTP survived at 9.062 s; a subsequent normal entry gained at 6.631 s. This is a narrowly observed encoding/caller path, not a pass for isolated-world serialization, reparsing allocation or durable completion of that native fault. Outer-worker restart profile reclamation and guaranteed shared-cgroup isolation remain open. The separate kernel-OOM durable probe passed after correcting a test-only wrong-token exception assumption: oom/oom_kill each increased by one at a 1 GiB peak; original HTTP completed after 6.589 s, then a normal browser-enriched job completed in the same worker after 6.907 s. Owner isolation, distinct current claims, immutable replay/original snapshot and clear cleanup slot passed. Earlier harness runs expected only LeaseLost; the existing browser-transition guard safely raises ValueError for a wrong token before claim validation. Accepting both documented outcomes fixed only the harness. This is observed recovery, not guaranteed shared-cgroup isolation or full A4 acceptance.
+
+The third unified review initially lacked its fourth report after an account usage-limit error. The user supplied the missing edge report on 2026-10-04; all fourteen third-review findings were then individually classified in the action plan. Verified latch/metadata/ruby corrections and ancestor-hidden script coverage are being implemented by the same agent. Ten first-instance deferred findings now have explicit owners, with unchanged carried findings preserved without duplicates. The sixteen-entry inventory includes two planned follow-ups for static boundaries and official API assessment; these do not broaden the six current implementation actions. A new immutable candidate must qualify the corrections before the scoped commit. All six action tickets remain in progress until their scoped gates are met. Deployed browser remains required and disabled; A3 deployment and A5 live session remain pending.
+
+The registered separate kernel-OOM case passed on the same immutable image: **one passed / 31 deselected**, 7.98 s, with caller/HTTP preserved, 1 GiB peak and oom/oom_kill each +1. The task database is retained for continuation. No local commit, push, deployment or activation occurred.
+
+## Review loop 3 — current metadata activity
+
+The direct third-review patch passed 36 actual native-latch and 40 initial metadata/authority cases in development overlays. However, all six actual stylesheet-only META/LINK reveal cases still incorrectly gained evidence: display:none→block, visibility:hidden→visible and opacity:0→1, with unchanged metadata attributes. The metadata group therefore routes to bad_plan loop 3. Fifteen positive source paths were archived and verified before only those code paths were reverted; parent/user documents remained untouched. The amended private handoff preserves a bounded current authored structure/style snapshot separately from the CSS-free body, and leaves original script/model authority unchanged. Re-derivation and a new exact-image integration/review are required.
+
+A further read-only probe on the previous immutable `82c58105…` image observed first MemoryError at the normal UTF-8 encoding call (line 304), then durable original HTTP completion under its current claim after 10.020 s. A subsequent normal browser job completed in the same worker after 7.657 s. Owner isolation, distinct claims, immutable replay/original snapshot and cleared cleanup slot passed; no kernel OOM event occurred. The first fault returned DEADLINE after the observed exception and deferred cleanup, so this does not qualify a particular RUNTIME_FAILED code or immediate profile reclamation. Evidence is `tmp/retro-final2-results/durable-native-encoding.txt`. This narrows the native-fault durable recovery gap for that historical image; current-image rerun, isolated serialization, native reparsing, permanent broader probe registration, restart reclamation and shared-cgroup guarantees remain open.
+
+Loop 3 final source is frozen: 637 local checks passed with 208 explicit gated skips; the final controlled overlay selection passed 58 cases, including 38 actual Chromium cases, with zero skips. The private stylesheet delimiter correction is included; six actual stale-activity negative controls demonstrate gate sensitivity. Parent verified all fifteen frozen paths, built immutable candidate `sha256:79ac65deea5f1cf27ed4cea01db584b9f5f8fd8b77dcdf0e619829427d8e4b22`, and matched its fourteen backend source/test/dependency hashes at UID10001 without overlays. The whole-backend/task-database and exact-image browser/supervision gates are running. This changed image requires its own database/fault/review evidence; no previous image or development overlay qualifies final acceptance.
+
+The final-source whole backend/task-database gate passed **1,225 tests / 213 explicitly gated skips / one deprecation warning**, 222.50 s. No failed covering local/database case was recorded. Actual Linux browser/supervision/DB-fault cases and the opt-in live broker case are explicitly skipped in that Windows run; current-image qualification is separate and still running. Evidence: `tmp/retro-final3-results/backend.xml` and `backend.txt`.
+
+The same final immutable candidate passed **339 browser/supervision cases / zero skips / one separate kernel-OOM case deselected**, 1,284.71 s, followed sequentially by **16 database browser/ownership/fault cases / zero skips / 57 deselected**, 98.87 s. The two reported latch/current-hint defects and their stylesheet/CSSOM variants are included. Death probes terminated owned processes while preserving the sentinel; init/bootstrap death removed profiles, while outer-worker death still left its interrupted profile. Delayed deletion recovered automatically with browser gain at 8.312 s. These are local exact-image passes under unchanged controls, not deployed or full A4 acceptance. XML and measured probe output are in `tmp/retro-final3-results/browser.xml`, `browser.txt`, `database.xml` and `database.txt`. The separate OOM and durable native allocation probes follow on this same image.
+
+Separate kernel-OOM registration passed **one test / zero skips / 31 deselected**, 8.17 s: caller/HTTP preserved after 7.041 s, peak 1,073,741,824 bytes, oom/oom_kill each +1. A separate durable probe on the same image observed original HTTP COMPLETED at 6.852 s, then PUBLIC_BROWSER COMPLETED at 7.453 s in the same worker, with owner isolation, distinct current claims, immutable replay/snapshot and clear cleanup slot. Real native UTF-8 allocation refusal was then directly observed at `_collected_views`, line 242, after real isolated collection returned 650,397 characters. Only runner address space was lowered; the first exception occurred at `text.encode("utf-8")`. Original HTTP completed at 8.380 s with RUNTIME_FAILED, followed by normal browser completion at 7.268 s; claims/owner/replay/cleanup checks passed and no kernel OOM occurred. These narrow durable observations are retained in `tmp/retro-final3-results/durable-oom.txt` and `durable-native-encoding.txt`; the broader harnesses are not permanent CI registration and do not establish isolated-world serialization failure, native reparsing, restart reclamation or guaranteed shared-cgroup survival.
+
+The subsequent current-image reparsing probe directly observed the first MemoryError at `_reparse:254`, the actual native `HTMLParser(dom)` constructor, after 650,397 encoded DOM characters reached reparsing. Only runner address space was constrained; production parsing was not replaced. Original HTTP completed with RUNTIME_FAILED at 8.553 s, then the same worker completed normal browser gain at 7.372 s. Owner isolation, distinct claims, immutable replay/snapshot and clear cleanup slot passed, with no kernel OOM. Evidence: `tmp/retro-final3-results/durable-native-reparse.txt`. This closes that narrow observed native-reparse/durable recovery path for the current image; isolated-world serialization, permanent registration of the broader probes, restart profile reclamation, broader Chromium phase timing and shared-cgroup guarantees remain open. All parent test/probe processes have now finished. Full review follows; no commit, deployment, activation or full acceptance is recorded yet.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-enforce-evidence-based-extraction-completion-gates-plan.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-enforce-evidence-based-extraction-completion-gates-plan.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-enforce-evidence-based-extraction-completion-gates-plan.md
@@ -0,0 +1,18 @@
+---
+title: "Enforce evidence-based extraction completion gates"
+ticket: 14
+status: in-progress
+baseline_revision: '50c9f37df40476c8be22f1a49af745e0a4e120e8'
+---
+
+## Authorized action and progress
+
+User approved retrospective A6 on 2026-10-03. [The applied gate](extraction-completion-gate.md) requires criterion-level current evidence, cross-baseline defect review, exact environment/image labels, observed allocation/fault outcomes and explicit human acceptance of scoped deferrals. A built/done label does not override unresolved required evidence.
+
+## Verification
+
+Six proposals are mapped to tickets with source/companion references and independent dependency/coverage validation. The earlier extension-construction follow-up is explicitly resolved by completed 2.6/accepted capture evidence; separate live acceptance, runtime, allocation and remaining coverage concerns retain their own routing. [Action execution](retrospective-action-execution.md) lists current successes and failures. The gate currently rejects/pends full acceptance because required rows remain open, demonstrating that applying proposals does not silently accept the epic.
+
+## Completion
+
+Gate and inventory changes are applied. The independent 2026-10-04 audit read all sixteen entries, existing child plans and companion records and found no mechanical gap or contradiction: no cycle, drift or unpinned dependency; each surviving concern has one owner; local links and historical run/PR references resolve. Planned 2.15/2.16 preserve the separate refinement, portal and operational prerequisites. Parent source/candidate integration remains before recording the scoped completion checkpoint. Full epic acceptance remains a separate human/evidence decision.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-enforce-evidence-based-extraction-completion-gates.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-enforce-evidence-based-extraction-completion-gates.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-enforce-evidence-based-extraction-completion-gates.md
@@ -0,0 +1,25 @@
+---
+id: 14
+type: story
+title: "Enforce evidence-based extraction completion gates"
+parent: epic-extraction
+covers: [R4]
+after: [9, 10]
+risk: medium
+---
+
+# Enforce evidence-based extraction completion gates
+
+## Description
+
+Apply an epic completion checklist that reconciles surviving defects, deployed capability, resource boundaries and superseded follow-ups with their source evidence.
+
+## Acceptance Criteria
+
+Verify: The extraction gate reports each criterion and every follow-up honestly, rejects unresolved blockers and distinguishes a declared deferral from a completed runtime or manual check.
+
+## References
+
+- parent — _bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md
+- gate — _bmad-output/initiative-vct-connect-year-one/epic-extraction/extraction-completion-gate.md, criterion and action inventory.
+- execution — _bmad-output/initiative-vct-connect-year-one/epic-extraction/retrospective-action-execution.md, current verification and prerequisites.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-qualify-browser-process-cleanup-and-memory-failure-boundarie-plan.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-qualify-browser-process-cleanup-and-memory-failure-boundarie-plan.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-qualify-browser-process-cleanup-and-memory-failure-boundarie-plan.md
@@ -0,0 +1,83 @@
+---
+title: 'Qualify browser process cleanup and memory failure boundaries'
+type: 'change'
+ticket: '12'
+created: '2026-10-03'
+status: 'in-progress'
+route: 'full'
+route_source: 'auto'
+review: 'thorough'
+review_source: 'auto'
+lenses_ran: []
+review_loop_iteration: 0
+baseline_revision: '50c9f37df40476c8be22f1a49af745e0a4e120e8'
+context: ['_bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md', '_bmad-output/initiative-vct-connect-year-one/epic-extraction/a4-browser-supervision-implementation-plan.md']
+---
+
+<frozen-after-approval reason="approved retrospective A4; user authorized implementation and qualification">
+
+## Intent
+
+**Problem:** Abrupt runner death can leave reparented descendants alive; independently slow process/profile cleanup can exceed the declared browser budget. Actual allocation-failure survival and durable HTTP completion need qualification.
+
+**Approach:** Establish per-attempt process ownership before browser launch, enforce one outer monotonic deadline including setup and cleanup, qualify allocation-failure preservation through the worker, and fix demonstrated defects. A compatible kernel attempt boundary is required; unavailable prerequisites decline rendering and retain HTTP evidence.
+
+## Boundaries & Constraints
+
+**Always:** Preserve nonroot supervisor/runner, Chromium sandbox, existing seccomp, secret-free environment, offline/CSP/network guards, source identities and strict gain/preservation, ten-second budget and original HTTP provenance. Keep deployed fallback false. Bound IPC while receiving. Record exact image and independent fault measurements.
+
+**Never:** Add privileged containers, host capabilities, cgroup delegation, sandbox bypass or larger budgets. Do not map the supervisor to UID0. Do not describe shared-cgroup OOM survival as guaranteed worker isolation or count a DOM_LIMIT/timeout as observed allocation failure. Missing safe ownership never falls back to ancestry-only cleanup.
+
+## I/O & Edge-Case Matrix
+
+| Scenario | Expected behavior | Qualification |
+| --- | --- | --- |
+| Namespace/pidfd/handshake prerequisite denied | RUNTIME_UNAVAILABLE; HTTP unchanged; no browser/profile/helper leak | Inject failures plus actual Linux prerequisite check |
+| Valid eligible three-platform cached HTML | Gain within total budget; strict original fields/provenance preserved | Existing actual browser union and queue gates |
+| Runner death with different-session/frozen/reparented descendants | Owned descendants terminate; unrelated sentinel survives; finite failure preserves HTTP | Actual namespace/kernel termination probes |
+| Slow process inspection or profile cleanup, stalled IPC | Outer deadline bounds caller; attempt terminated; bounded leftover cleanup policy | Independent delayed operations, finite watchdog, repeat/backlog check |
+| Output exceeds cap or is malformed | Bounded receipt and finite existing failure code; HTTP unchanged | Observe receipt cap before full buffering |
+| Observed allocation refusal/OOM | Caller survives and persists immutable original HTTP with current claim; subsequent work progresses | Instrumented actual allocations, memory event observation and database-backed persistence; targeted normal DOM serialization separately recorded |
+| Incompatible memory/runtime environment | Explicit unqualified gate; fallback remains disabled | No claim of guaranteed worker survival or deployed qualification |
+
+</frozen-after-approval>
+
+## Code Map
+
+- `backend/app/extraction/browser.py`: currently supervises only runner ancestry, buffers communicate before checking output, performs unbounded worker-side cleanup. Replace with bounded outer protocol and retained kernel namespace-owner pidfd.
+- New small trusted bootstrap/supervisor under `backend/app/extraction/`: single-threaded user+PID namespace setup with nonzero ID maps, bounded READY/ACK before runner launch, own profile/cleanup and child lifetime. Use the detailed supporting recommendation for ownership/death races. Keep setup independent from threaded worker.
+- `backend/app/extraction/browser_runner.py`: reuse selected-evidence/security work from A1; adjust only allocation-bound collection/runner failure behavior if measured probes justify it.
+- `backend/tests/test_browser_supervision.py`: focused protocol/fault tests and actual Linux qualification; selected result and survivor assertions independent of production implementation.
+- `backend/tests/test_browser_fallback.py`: existing actual browser security/function gates.
+- `backend/tests/test_postgres_tracer.py`: actual retained HTTP failure completion/owner/provenance and next-job evidence.
+- `.github/workflows/ci.yml`: include focused actual supervision gates in existing controlled browser gate if new module needs explicit registration. Keep resource/network/security controls.
+
+## Tasks & Acceptance
+
+- [ ] Correct demonstrated F4/F5 ownership/deadline defects with a safe kernel attempt boundary and bounded worker-side receipt.
+- [ ] Add regressions for abrupt death, independent cleanup delays and denied prerequisites/output cap; prove original failures against baseline where applicable.
+- [ ] Qualify actual allocation refusal/kernel OOM separately from normal DOM serialization and durable worker completion; record any remaining runtime-dependent gap.
+- [ ] Run actual browser preservation/security/gain and affected local tests; parent runs shared candidate image/database gates.
+- [ ] Reconcile findings in the parent unified thorough review.
+
+**Acceptance Criteria:** Given the approved fault scenarios, when a browser attempt fails, then its ownership survives runner reparenting, the outer budget bounds the caller and unchanged HTTP evidence can complete under its owner/claim. Given unavailable safe prerequisites, no unsafe runner is launched. Given an unobserved allocation-failure path, its gate remains explicitly open and deployed activation stays disabled.
+
+## Implementation Notes
+
+The parent initialized bmad-build and owns ticket coordination/review/completion. This is its explicit step-03 handoff, not a new skill invocation; do not render/restart the workflow. Edit scoped source/tests directly, report every changed path, no commit and no cloud operations. Preserve A1/A2 and unrelated user/demo changes. Parent owns local Docker recovery, image creation and shared PostgreSQL container `vct-retro-postgres` (port55439); never remove/reconfigure it. Local finite controlled Docker probes may run once engine is available, but no skipped test is a pass.
+
+The supporting A4 recommendation records proposed controls and verified baseline faults; implementation may choose the simplest equivalent kernel design meeting the frozen constraints. Unsupported unshare/mapping must fail closed. PID namespace ownership does not solve shared-cgroup OOM victim selection; keep that limit explicit and do not manufacture a pass. Do not touch fetch/decompression or CSS resolution.
+
+Parent baseline-image prerequisite probe passed combined user+PID unshare, single-ID maps, namespace PID1 at UID/GID10001 and outer retained pidfd termination under existing controls. Nested Chromium launch remains to qualify. Docker has recovered after runtime socket repair; the disposable test database is running. The parent has a CSS checkpoint image `vct-backend:retro-css` (sha256:635354824a2dae125b105f4779bcfe46adf523ae89f1797c371a06fc2b4d4f7e); it deliberately uses baseline fetch and is not the final candidate. Actual child source/test images must reflect your code before qualification.
+
+Integration ownership update: the A1 implementer is diagnosing a repeated 1688 restored-visibility DEADLINE in `browser_runner.py` / `test_browser_fallback.py` (44/45 new actual cases passed). Preserve that concurrent work; A4 owns `browser.py`, the new supervisor/protocol/fault tests, database fault tests and CI registration. Do not edit runner or existing browser-fallback tests without handing the necessary change to the parent. Target allocation-failure probes through the focused qualification harness; any required runner allocation correction is coordinated separately.
+
+## Plan Change Log
+
+## Review Triage Log
+
+Parent unified V2 and integration P1 confirmed automatic cleanup recovery was untested and could starve indefinitely: a 0.7-second healthy deletion is repeatedly killed by 0.5-second drain windows. Re-derivation uses the existing total deadline and adds actual subsequent gain without private test intervention. The prior source handoff and image are historical development evidence; A4 remains incomplete for required open gates. See `../../implementation-artifacts/plan-extraction-retrospective-actions.md` for every verdict and route.
+
+## Verification
+
+Run focused unit/protocol tests, actual Linux nonroot namespace/runner death and independent cleanup probes under existing seccomp/network none/0.5CPU1GiB/no-swap/256MiB shared-memory controls. Require immutable candidate image, no skips for covering cases, elapsed time, owned/unrelated liveness and profile result. Parent runs database-backed fault-preservation and current browser union separately. Preserve explicit G1–G6 unrun/failure rows from the supporting plan until observed.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-qualify-browser-process-cleanup-and-memory-failure-boundarie.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-qualify-browser-process-cleanup-and-memory-failure-boundarie.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-qualify-browser-process-cleanup-and-memory-failure-boundarie.md
@@ -0,0 +1,29 @@
+---
+id: 12
+type: story
+title: "Qualify browser process cleanup and memory failure boundaries"
+parent: epic-extraction
+covers: [R4]
+after: [9, 10]
+risk: high
+---
+
+# Qualify browser process cleanup and memory failure boundaries
+
+## Description
+
+Exercise abrupt runner death, slow cleanup and allocation failure under the existing sandbox limits and correct any demonstrated loss of cleanup or preserved HTTP evidence.
+
+## Acceptance Criteria
+
+Verify: Actual container fault probes report descendant cleanup, bounded termination, worker survival and preserved HTTP evidence with no skipped covering case.
+
+## References
+
+- parent — _bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md
+- preparation — _bmad-output/initiative-vct-connect-year-one/epic-extraction/browser-runtime-decision.md, Concrete qualification path. This prepares controls; it does not claim cloud qualification.
+- retrospective — _bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction-retrospective.md, A4 and F4–F6.
+
+## Notes
+
+- Open question: The three runtime failure hypotheses require measured qualification before activation.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-resolve-deployed-browser-runtime-availability-and-acceptance-plan.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-resolve-deployed-browser-runtime-availability-and-acceptance-plan.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-resolve-deployed-browser-runtime-availability-and-acceptance-plan.md
@@ -0,0 +1,18 @@
+---
+title: "Resolve deployed browser runtime availability and acceptance scope"
+ticket: 11
+status: in-progress
+baseline_revision: '50c9f37df40476c8be22f1a49af745e0a4e120e8'
+---
+
+## Authorized action and progress
+
+User approved retrospective A3 on 2026-10-03. [The concrete runtime decision](browser-runtime-decision.md) records current cloud environment, exact deployed digest, known probe limitations and compatible-host controls. [A4 qualification](story-qualify-browser-process-cleanup-and-memory-failure-boundarie-plan.md) precedes activation. The deployed fallback flag stays false.
+
+## Remaining completion prerequisite
+
+The user decided on 2026-10-04 to keep deployed browser enrichment required and full epic acceptance pending. The scoped-deferral alternative was not accepted. Remaining: a concrete compatible-cloud-host delivery plan and infrastructure/release decision, followed by exact-image deployed qualification. No new paid resource or deployment was made. This ticket remains in progress until that evidence exists.
+
+## Verification
+
+Read-only Azure runtime inspection and existing historical probe are recorded in the companion decision. Local namespace/browser gates are separately recorded in [action execution](retrospective-action-execution.md), never substituted for deployed gain.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-resolve-deployed-browser-runtime-availability-and-acceptance.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-resolve-deployed-browser-runtime-availability-and-acceptance.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-resolve-deployed-browser-runtime-availability-and-acceptance.md
@@ -0,0 +1,29 @@
+---
+id: 11
+type: story
+title: "Resolve deployed browser runtime availability and acceptance scope"
+parent: epic-extraction
+covers: [R4]
+after: [12]
+hitl: true
+risk: high
+---
+
+# Resolve deployed browser runtime availability and acceptance scope
+
+## Description
+
+Qualify a compatible supervised Chromium runtime or record an explicit delivery-scope decision retaining disabled fallback until the measured runtime prerequisites hold.
+
+## Acceptance Criteria
+
+Verify: The runtime decision identifies the exact supported environment, required qualification evidence and deployment activation gate without relaxing sandbox controls.
+
+## References
+
+- parent — _bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md
+- decision — _bmad-output/initiative-vct-connect-year-one/epic-extraction/browser-runtime-decision.md, proposed scope and exact-environment activation gates.
+
+## Notes
+
+- Open question: Cloud deployment or a paid runtime change needs a concrete release decision after investigation.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-verify-signed-in-extension-payload-and-merged-results-plan.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-verify-signed-in-extension-payload-and-merged-results-plan.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-verify-signed-in-extension-payload-and-merged-results-plan.md
@@ -0,0 +1,18 @@
+---
+title: "Verify signed-in extension payload and merged results"
+ticket: 13
+status: in-progress
+baseline_revision: '50c9f37df40476c8be22f1a49af745e0a4e120e8'
+---
+
+## Authorized action and progress
+
+User approved retrospective A5 on 2026-10-03. [The concrete live acceptance checklist](extension-acceptance-checklist.md) covers selected-only wire JSON, persisted owner-scoped merge/provenance, result opening/recovery and live Taobao shop capture. Prior accepted item/import checks and the manual deferral are preserved.
+
+## Verification
+
+Frontend 72 tests and type checking passed. Supporting backend merge/replay suite passed 215 tests. Disposable PostgreSQL extension/Taobao capture support passed six persisted ownership/replay/quota/secret-rejection cases. [Action execution](retrospective-action-execution.md) records commands and limitations. These use deterministic/test-verifier boundaries, not the user's signed-in browser.
+
+## Remaining completion prerequisite
+
+Connected accessible source session and actual latest-release wire/result/shop observations. Browser inventory exposed no Chrome/Edge source session. Live rows stay pending; no credentials or unredacted HAR is retained. Ticket remains in progress until these observations exist.
diff --git a/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-verify-signed-in-extension-payload-and-merged-results.md b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-verify-signed-in-extension-payload-and-merged-results.md
new file mode 100644
--- /dev/null
+++ b/_bmad-output/initiative-vct-connect-year-one/epic-extraction/story-verify-signed-in-extension-payload-and-merged-results.md
@@ -0,0 +1,29 @@
+---
+id: 13
+type: story
+title: "Verify signed-in extension payload and merged results"
+parent: epic-extraction
+covers: [R4]
+after: [9, 10]
+hitl: true
+risk: high
+---
+
+# Verify signed-in extension payload and merged results
+
+## Description
+
+Complete latest-release selected-only wire payload, owner-scoped merge, result-opening and live Taobao shop checks using an accessible source session.
+
+## Acceptance Criteria
+
+Verify: Recorded browser/network observations and persisted result metadata demonstrate the signed-in journey without platform credentials or duplicate evidence.
+
+## References
+
+- parent — _bmad-output/initiative-vct-connect-year-one/epic-extraction/epic-extraction.md
+- acceptance — _bmad-output/initiative-vct-connect-year-one/epic-extraction/extension-acceptance-checklist.md, required live journey and supporting automated gates.
+
+## Notes
+
+- Open question: An authenticated accessible shop page and browser session are required for live shop acceptance.
diff --git a/backend/app/extraction/browser_supervisor.py b/backend/app/extraction/browser_supervisor.py
new file mode 100644
--- /dev/null
+++ b/backend/app/extraction/browser_supervisor.py
@@ -0,0 +1,171 @@
+"""Trusted single-threaded Linux bootstrap. Source input goes only to the runner.
+
+The outer worker retains the namespace init pidfd before acknowledging READY.
+Init death terminates every namespace member in the kernel, across sessions and
+nested namespaces. This is process ownership, not shared-cgroup OOM isolation.
+"""
+import ctypes
+import json
+import os
+from pathlib import Path
+import select
+import shutil
+import signal
+import socket
+import subprocess
+import sys
+
+CONTROL_BYTES = 512
+CLONE_NEWUSER = 0x10000000
+CLONE_NEWPID = 0x20000000
+
+
+def _prctl(option, value):
+    libc = ctypes.CDLL(None, use_errno=True)
+    if libc.prctl(option, value, 0, 0, 0) != 0:
+        raise OSError(ctypes.get_errno(), "prctl")
+
+
+def _parent_death(parent):
+    _prctl(1, signal.SIGKILL)  # PR_SET_PDEATHSIG; set after credential changes.
+    if os.getppid() != parent:
+        raise OSError("parent exited")
+
+
+def _unshare():
+    libc = ctypes.CDLL(None, use_errno=True)
+    if libc.unshare(CLONE_NEWUSER | CLONE_NEWPID) != 0:
+        raise OSError(ctypes.get_errno(), "unshare")
+
+
+def _map_ids(uid, gid):
+    Path("/proc/self/uid_map").write_text(f"{uid} {uid} 1\n")
+    Path("/proc/self/setgroups").write_text("deny\n")
+    Path("/proc/self/gid_map").write_text(f"{gid} {gid} 1\n")
+
+
+def _drop_capabilities():
+    class Header(ctypes.Structure):
+        _fields_ = [("version", ctypes.c_uint32), ("pid", ctypes.c_int)]
+    class Data(ctypes.Structure):
+        _fields_ = [("effective", ctypes.c_uint32), ("permitted", ctypes.c_uint32),
+                    ("inheritable", ctypes.c_uint32)]
+    libc = ctypes.CDLL(None, use_errno=True)
+    if libc.capset(ctypes.byref(Header(0x20080522, 0)), (Data * 2)()) != 0:
+        raise OSError(ctypes.get_errno(), "capset")
+
+
+def _send(control, **message):
+    control.send(json.dumps(message).encode("ascii"))
+
+
+def _runner_command():
+    return [sys.executable, "-m", "backend.app.extraction.browser_runner"]
+
+
+def _cleanup_profile(directory):
+    # Directory is generated by the trusted worker, never by source content.
+    try:
+        shutil.rmtree(directory)
+    except FileNotFoundError:
+        pass
+
+
+def _init(control, directory, gate):
+    # Parent is outside this PID namespace (getppid() == 0). The bootstrap
+    # must receive positive arming confirmation before releasing this gate.
+    # A buffered release alone cannot prove the parent was alive at arming.
+    _prctl(1, signal.SIGKILL)
+    gate.settimeout(2)
+    gate.send(b"ARMED")
+    if gate.recv(CONTROL_BYTES + 1) != b"1":
+        return 1
+    gate.close()
+    if os.getpid() != 1 or os.geteuid() == 0 or os.getegid() == 0:
+        return 1
+    _drop_capabilities()
+    control.settimeout(2)
+    _send(control, kind="READY", pid=1, uid=os.geteuid(), gid=os.getegid())
+    if control.recv(CONTROL_BYTES + 1) != b"ACK":
+        return 1
+    # No browser or filesystem setup precedes the retained owner/ACK.
+    os.mkdir(directory, mode=0o700)
+    runner = subprocess.Popen(_runner_command(), close_fds=True)
+    control.setblocking(False)
+    while runner.poll() is None:
+        readable, _, _ = select.select([control], [], [], .02)
+        if readable and control.recv(CONTROL_BYTES + 1) != b"":
+            return 1  # No messages are accepted after ACK.
+        if readable:
+            return 1  # Worker closed its lifetime channel.
+    return 0 if runner.returncode == 0 else 1
+
+
+def bootstrap(control, directory):
+    parent = os.getppid()
+    uid, gid = os.geteuid(), os.getegid()
+    child = None
+    gate_parent = gate_child = None
+    try:
+        if uid == 0 or gid == 0:
+            raise OSError("nonroot required")
+        _parent_death(parent)
+        _unshare()
+        _map_ids(uid, gid)
+        _parent_death(parent)
+        gate_parent, gate_child = socket.socketpair(socket.AF_UNIX, socket.SOCK_SEQPACKET)
+        gate_parent.settimeout(2)
+        child = os.fork()
+        if child == 0:
+            gate_parent.close()
+            try:
+                status = _init(control, directory, gate_child)
+            except BaseException:
+                status = 1
+            os._exit(status)  # PID 1 exit kills all owned descendants.
+        gate_child.close()
+        gate_child = None
+        _drop_capabilities()
+        _send(control, kind="OWNER", pid=child)
+        if gate_parent.recv(CONTROL_BYTES + 1) != b"ARMED":
+            raise OSError("init not armed")
+        gate_parent.send(b"1")
+        gate_parent.close()
+        gate_parent = None
+        control.close()
+        _, status = os.waitpid(child, 0)
+        _cleanup_profile(directory)
+        return 0 if os.waitstatus_to_exitcode(status) == 0 else 1
+    except BaseException:
+        # No source material or exception text on the protocol channel.
+        if gate_parent is not None:
+            gate_parent.close()
+            gate_parent = None
+        if child is not None:
+            try:
+                os.kill(child, signal.SIGKILL)
+                os.waitpid(child, 0)
+            except OSError:
+                pass
+        try:
+            _send(control, kind="UNAVAILABLE")
+        except OSError:
+            pass
+        return 1
+    finally:
+        for gate in (gate_parent, gate_child):
+            if gate is not None:
+                gate.close()
+        control.close()
+
+
+def main():
+    if len(sys.argv) == 3 and sys.argv[1] == "--cleanup":
+        _cleanup_profile(sys.argv[2])
+        return 0
+    control = socket.socket(fileno=int(sys.argv[1]))
+    return bootstrap(control, sys.argv[2])
+
+
+if __name__ == "__main__":
+    sys.exit(main())
diff --git a/backend/tests/test_browser_supervision.py b/backend/tests/test_browser_supervision.py
new file mode 100644
--- /dev/null
+++ b/backend/tests/test_browser_supervision.py
@@ -0,0 +1,508 @@
+"""Independent Linux ownership/fault qualification; opt in inside controlled image.
+
+No skipped case establishes qualification. Faults modify only test-launched
+trusted helpers, never the production runner/security policy or its environment.
+"""
+from copy import deepcopy
+import json
+import os
+from pathlib import Path
+import signal
+import subprocess
+import sys
+import threading
+import time
+
+import pytest
+
+from backend.app.extraction import browser
+from backend.tests.test_browser_fallback import extracted
+
+LINUX = pytest.mark.skipif(
+    sys.platform != "linux" or os.getenv("VCT_TEST_BROWSER") != "true",
+    reason="Explicit controlled nonroot Linux namespace qualification required",
+)
+
+
+def install_supervisor(monkeypatch, *, runner=None, setup=""):
+    """Inject independent faults in the single-threaded test bootstrap."""
+    path = str(Path(browser.__file__).with_name("browser_supervisor.py"))
+    source = ("import sys, importlib.util\n"
+              f"spec=importlib.util.spec_from_file_location('s', {path!r})\n"
+              "s=importlib.util.module_from_spec(spec)\nspec.loader.exec_module(s)\n" + setup + "\n")
+    if runner is not None:
+        source += f"s._runner_command = lambda: [sys.executable, '-c', {runner!r}]\n"
+    source += "sys.exit(s.main())\n"
+    monkeypatch.setattr(browser, "_bootstrap_command", lambda fd, directory:
+                        [sys.executable, "-c", source, str(fd), directory])
+
+
+def attempt():
+    result, html = extracted()
+    return browser.render_cached(html, result["source_url"], "1688", "ACCOUNT_PUBLIC", [])
+
+
+def preserve_attempt(caplog):
+    original, html = extracted()
+    frozen = deepcopy(original)
+    with caplog.at_level("INFO", logger=browser.__name__):
+        started = time.monotonic()
+        selected = browser.maybe_render(original, html, html.encode(), enabled=True)
+        elapsed = time.monotonic() - started
+    assert selected is original and original == frozen, caplog.text
+    assert elapsed < 11
+    return elapsed
+
+
+def alive(pid):
+    try:
+        return Path(f"/proc/{pid}/stat").read_text().rsplit(")", 1)[1].split()[0] not in {"Z", "X"}
+    except FileNotFoundError:
+        return False
+
+
+def wait_gone(pids, seconds=1):
+    deadline = time.monotonic() + seconds
+    while any(alive(pid) for pid in pids) and time.monotonic() < deadline:
+        time.sleep(.01)
+    assert not any(alive(pid) for pid in pids), pids
+
+
+def lifetime_runner(marker):
+    return f"""
+import json, os, signal, subprocess, sys, time
+from pathlib import Path
+def outer():
+ return int(next(x for x in Path('/proc/self/status').read_text().splitlines() if x.startswith('NSpid:')).split()[1])
+def parent(pid):
+ return int(Path(f'/proc/{{pid}}/stat').read_text().rsplit(')',1)[1].split()[1])
+pid=outer(); init=parent(pid); bootstrap=parent(init)
+child_source="from pathlib import Path; import os,signal,time; p=int(next(x for x in Path('/proc/self/status').read_text().splitlines() if x.startswith('NSpid:')).split()[1]); Path(" + repr({str(marker) + '.child'!r}) + ").write_text(str(p)); os.kill(os.getpid(),signal.SIGSTOP); time.sleep(60)"
+child=subprocess.Popen([sys.executable,'-c',child_source],start_new_session=True)
+end=time.monotonic()+2
+while not Path({str(marker) + '.child'!r}).exists() and time.monotonic()<end: time.sleep(.01)
+descendant=int(Path({str(marker) + '.child'!r}).read_text())
+Path({str(marker)!r}).write_text(json.dumps(dict(runner=pid,init=init,bootstrap=bootstrap,
+ worker=parent(bootstrap),descendant=descendant,directory=os.environ['HOME'])))
+time.sleep(60)
+"""
+
+
+@LINUX
+def test_actual_bootstrap_death_before_init_arming_never_launches(monkeypatch, tmp_path, caplog, cleanup_slot):
+    marker = tmp_path / 'pre-arm'
+    launched = tmp_path / 'runner-launched'
+    setup = f"""
+import json, os, time
+from pathlib import Path
+marker=Path({str(marker)!r})
+arm=Path(str(marker)+'.arm')
+boundary=Path(str(marker)+'.boundary')
+resume=Path(str(marker)+'.resume')
+prctl=s._prctl
+def delayed_arm(option,value):
+ if os.getpid()==1 and option==1:
+  arm.touch()
+  cutoff=time.monotonic()+2
+  while not resume.exists() and time.monotonic()<cutoff: time.sleep(.005)
+ return prctl(option,value)
+s._prctl=delayed_arm
+send=s._send
+def record_owner(control,**message):
+ send(control,**message)
+ if message.get('kind')=='OWNER':
+  marker.write_text(json.dumps(dict(bootstrap=os.getpid(),init=message['pid'])))
+s._send=record_owner
+recv=s.socket.socket.recv
+def record_wait(channel,*args):
+ if os.getpid()!=1: boundary.touch()
+ return recv(channel,*args)
+s.socket.socket.recv=record_wait
+# Also reaches the old one-way gate after its buffered release. This makes
+# the injection reproduce the pre-fix launch rather than killing before it.
+write=s.os.write
+def record_release(fd,data):
+ result=write(fd,data)
+ if data==b'1': boundary.touch()
+ return result
+s.os.write=record_release
+"""
+    install_supervisor(monkeypatch, setup=setup,
+                       runner=f"from pathlib import Path;Path({str(launched)!r}).touch();print('{{\"code\":\"NO_GAIN\"}}')")
+    data, errors = [], []
+    def kill_before_arm():
+        try:
+            cutoff = time.monotonic() + 8
+            while (not marker.exists() or not Path(str(marker) + '.arm').exists()
+                   or not Path(str(marker) + '.boundary').exists()) and time.monotonic() < cutoff:
+                time.sleep(.005)
+            observed = json.loads(marker.read_text())
+            data.append(observed)
+            handle = os.pidfd_open(observed['bootstrap'])
+            try:
+                signal.pidfd_send_signal(handle, signal.SIGKILL)
+            finally:
+                os.close(handle)
+            Path(str(marker) + '.resume').touch()
+        except BaseException as error:
+            errors.append(error)
+    killer = threading.Thread(target=kill_before_arm)
+    sentinel = subprocess.Popen([sys.executable, '-c', 'import time;time.sleep(60)'])
+    try:
+        killer.start()
+        elapsed = preserve_attempt(caplog)
+        killer.join(timeout=1)
+        assert not killer.is_alive() and not errors, errors
+        assert data
+        wait_gone(list(data[0].values()))
+        assert not launched.exists()
+        assert sentinel.poll() is None
+        print(json.dumps(dict(probe='pre-arm-bootstrap-death', elapsed=elapsed,
+                              owned=data[0], owned_alive=False, runner_launched=False, sentinel_alive=True)))
+    finally:
+        sentinel.kill()
+        sentinel.wait(timeout=1)
+        killer.join(timeout=1)
+
+
+@LINUX
+@pytest.mark.parametrize("target", ["init", "bootstrap"])
+def test_actual_owner_and_bootstrap_death_chain(monkeypatch, tmp_path, target, caplog, cleanup_slot):
+    marker = tmp_path / "lifetime"
+    install_supervisor(monkeypatch, runner=lifetime_runner(marker))
+    data, errors = [], []
+    def kill_owner():
+        try:
+            cutoff = time.monotonic() + 8
+            while not marker.exists() and time.monotonic() < cutoff:
+                time.sleep(.01)
+            observed = json.loads(marker.read_text())
+            data.append(observed)
+            fd = os.pidfd_open(observed[target])
+            try:
+                signal.pidfd_send_signal(fd, signal.SIGKILL)
+            finally:
+                os.close(fd)
+        except BaseException as error:
+            errors.append(error)
+    killer = threading.Thread(target=kill_owner)
+    sentinel = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(60)"])
+    try:
+        killer.start()
+        elapsed = preserve_attempt(caplog)
+        killer.join(timeout=1)
+        assert not killer.is_alive() and not errors, errors
+        assert data
+        wait_gone([data[0][name] for name in ("runner", "init", "bootstrap", "descendant")])
+        assert sentinel.poll() is None
+        assert "code=RUNTIME_FAILED" in caplog.text
+        if browser._pending_cleanup is not None:
+            assert browser._drain_cleanup(time.monotonic() + 3)
+        assert not Path(data[0]["directory"]).exists()
+        print(json.dumps(dict(probe="death-chain", target=target, elapsed=elapsed,
+                              owned=data[0], owned_alive=False, sentinel_alive=True, profiles_clean=True)))
+    finally:
+        sentinel.kill()
+        sentinel.wait(timeout=1)
+        killer.join(timeout=1)
+
+
+@LINUX
+def test_actual_outer_parent_death_terminates_namespace(monkeypatch, tmp_path):
+    marker = tmp_path / "parent-death"
+    install_supervisor(monkeypatch, runner=lifetime_runner(marker))
+    command = browser._bootstrap_command(999, "unused")
+    source = ("from backend.app.extraction import browser as b\n"
+              f"b._bootstrap_command=lambda fd,d: {command[:3]!r}+[str(fd),d]\n"
+              "b.render_cached('<html></html>','https://detail.1688.com/offer/123.html','1688','ACCOUNT_PUBLIC',[])\n")
+    worker = subprocess.Popen([sys.executable, "-c", source], cwd=Path(browser.__file__).resolve().parents[3],
+                              env=browser._environment("/tmp"), stdin=subprocess.DEVNULL,
+                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
+    sentinel = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(60)"])
+    observed = None
+    try:
+        cutoff = time.monotonic() + 8
+        while not marker.exists() and time.monotonic() < cutoff and worker.poll() is None:
+            time.sleep(.01)
+        observed = json.loads(marker.read_text())
+        handle = os.pidfd_open(worker.pid)
+        try:
+            signal.pidfd_send_signal(handle, signal.SIGKILL)
+        finally:
+            os.close(handle)
+        worker.wait(timeout=1)
+        wait_gone([observed[name] for name in ("runner", "init", "bootstrap", "descendant")])
+        assert sentinel.poll() is None
+        # A killed worker cannot delete its profile. Record it explicitly and
+        # remove only this test's known directory with a bounded helper.
+        leftover = Path(observed["directory"]).exists()
+        print(json.dumps(dict(probe="outer-parent-death", owned=observed, owned_alive=False,
+                              sentinel_alive=True, interrupted_profile=leftover)))
+    finally:
+        if worker.poll() is None:
+            worker.kill()
+            worker.wait(timeout=1)
+        sentinel.kill()
+        sentinel.wait(timeout=1)
+        if observed is not None:
+            subprocess.run(browser._cleanup_command(observed["directory"]), timeout=3, check=True)
+
+
+@pytest.fixture
+def cleanup_slot():
+    yield
+    if sys.platform == "linux" and browser._pending_cleanup is not None:
+        assert browser._drain_cleanup(time.monotonic() + 2), browser._pending_cleanup
+
+
+def test_non_linux_declines_without_launch(monkeypatch):
+    monkeypatch.setattr(browser.sys, "platform", "win32")
+    monkeypatch.setattr(browser.subprocess, "Popen", lambda *a, **kw: pytest.fail("Unsafe launch"))
+    assert attempt() == {"code": "RUNTIME_UNAVAILABLE"}
+
+
+@LINUX
+def test_actual_owner_nonzero_ids_and_no_capabilities(monkeypatch):
+    install_supervisor(monkeypatch, runner="""
+import json, os
+from pathlib import Path
+assert os.geteuid() == os.getegid() == 10001
+assert os.getpid() > 1
+assert 'CapEff:\\t0000000000000000' in Path('/proc/self/status').read_text()
+print(json.dumps({'code':'NO_GAIN'}))
+""")
+    profiles = set(Path("/tmp").glob("vct-browser-*"))
+    assert attempt() == {"code": "NO_GAIN"}
+    assert set(Path("/tmp").glob("vct-browser-*")) == profiles
+
+
+@LINUX
+@pytest.mark.parametrize("failure", ["unshare", "maps", "caps", "ready", "pidfd", "signal",
+                                    "owner_pidfd", "owner_signal", "ack", "control_limit"])
+def test_actual_denied_prerequisite_never_launches(monkeypatch, tmp_path, failure, cleanup_slot):
+    marker = tmp_path / "runner-launched"
+    setup = ""
+    if failure in {"unshare", "maps", "caps"}:
+        name = {"unshare": "_unshare", "maps": "_map_ids", "caps": "_drop_capabilities"}[failure]
+        setup = f"def deny(*a): raise PermissionError('injected')\ns.{name}=deny"
+    elif failure == "ready":
+        setup = "s._send_original=s._send\ndef send(c, **m):\n if m.get('kind')=='READY': m['uid']=0\n s._send_original(c, **m)\ns._send=send"
+    elif failure == "control_limit":
+        setup = "s._send_original=s._send\ndef send(c, **m):\n if m.get('kind')=='READY': m['pad']='x'*1000\n s._send_original(c, **m)\ns._send=send"
+    install_supervisor(monkeypatch, setup=setup,
+                       runner=f"from pathlib import Path; Path({str(marker)!r}).touch()")
+    if failure in {"pidfd", "signal", "owner_pidfd", "owner_signal"}:
+        module, attribute = (os, "pidfd_open") if failure.endswith("pidfd") else (signal, "pidfd_send_signal")
+        original = getattr(module, attribute)
+        calls = 0
+        def deny(*args, **kwargs):
+            nonlocal calls
+            calls += 1
+            if ((failure.startswith("owner_") and calls == 3)
+                    or failure == "pidfd" or (failure == "signal" and args[1] == 0)):
+                raise PermissionError("injected")
+            return original(*args, **kwargs)
+        monkeypatch.setattr(module, attribute, deny)
+    elif failure == "ack":
+        original = browser.socket.socket.send
+        def deny_ack(channel, data, *args):
+            if data == b"ACK":
+                raise PermissionError("injected")
+            return original(channel, data, *args)
+        monkeypatch.setattr(browser.socket.socket, "send", deny_ack)
+    profiles = set(Path("/tmp").glob("vct-browser-*"))
+    assert attempt() == {"code": "RUNTIME_UNAVAILABLE"}
+    assert not marker.exists()
+    assert set(Path("/tmp").glob("vct-browser-*")) == profiles
+
+
+@LINUX
+@pytest.mark.parametrize("frozen", [False, True])
+def test_actual_abrupt_runner_death_owns_reparented_sessions(monkeypatch, tmp_path, frozen, caplog, cleanup_slot):
+    marker = tmp_path / "descendants"
+    runner = f"""
+import os, signal, time
+from pathlib import Path
+def outer_pid():
+ return int(next(x for x in Path('/proc/self/status').read_text().splitlines() if x.startswith('NSpid:')).split()[1])
+if os.fork() == 0:
+ os.setsid()
+ if os.fork() != 0: os._exit(0)
+ Path({str(marker)!r}).write_text(str(outer_pid()))
+ if {frozen!r}: os.kill(os.getpid(), signal.SIGSTOP)
+ time.sleep(60)
+ os._exit(0)
+end=time.monotonic()+1
+while not Path({str(marker)!r}).exists() and time.monotonic()<end: time.sleep(.01)
+os.kill(os.getpid(), signal.SIGKILL)
+"""
+    install_supervisor(monkeypatch, runner=runner)
+    sentinel = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(60)"], start_new_session=True)
+    try:
+        elapsed = preserve_attempt(caplog)
+        pid = int(marker.read_text())
+        wait_gone([pid])
+        assert sentinel.poll() is None
+        assert "code=RUNTIME_FAILED" in caplog.text
+        print(json.dumps(dict(probe="runner-death", frozen=frozen, elapsed=elapsed,
+                              descendant_pid=pid, owned_alive=alive(pid), sentinel_alive=True)))
+    finally:
+        sentinel.kill()
+        sentinel.wait(timeout=1)
+
+
+@LINUX
+@pytest.mark.parametrize("operation", ["mkdir", "delete", "ready", "stdout", "proc"])
+def test_actual_independent_stalls_bound_outer_deadline(monkeypatch, operation, caplog, cleanup_slot):
+    setup = "import time\n"
+    runner = "import json; print(json.dumps({'code':'NO_GAIN'}))"
+    if operation == "mkdir":
+        setup += "s.mkdir_original=s.os.mkdir\ndef mkdir(*a, **kw):\n time.sleep(12)\n return s.mkdir_original(*a, **kw)\ns.os.mkdir=mkdir"
+    elif operation == "delete":
+        setup += "s.cleanup_original=s._cleanup_profile\ndef cleanup(p):\n time.sleep(12)\n s.cleanup_original(p)\ns._cleanup_profile=cleanup"
+    elif operation == "ready":
+        setup += "s._send_original=s._send\ndef send(c, **m):\n if m.get('kind')=='READY': time.sleep(12)\n s._send_original(c, **m)\ns._send=send"
+    elif operation == "stdout":
+        runner = "import sys,time; sys.stdout.write('{'); sys.stdout.flush(); time.sleep(12)"
+    else:
+        # Independent regression: caller must not perform the old three walks.
+        def denied_walk(*args):
+            pytest.fail("Worker attempted ancestry-based process inspection")
+        monkeypatch.setattr(browser.Path, "iterdir", denied_walk)
+        setup += "s.iter_original=s.Path.iterdir\ndef walk(p):\n time.sleep(4)\n return s.iter_original(p)\ns.Path.iterdir=walk"
+        runner = "import os,signal; os.kill(os.getpid(),signal.SIGKILL)"
+    install_supervisor(monkeypatch, runner=runner, setup=setup)
+    profiles = set(Path("/tmp").glob("vct-browser-*"))
+    elapsed = preserve_attempt(caplog)
+    assert ("code=RUNTIME_UNAVAILABLE" if operation == "ready" else
+            "code=RUNTIME_FAILED" if operation == "proc" else "code=DEADLINE") in caplog.text
+    deferred = browser._pending_cleanup is not None
+    if deferred:
+        assert browser._drain_cleanup(time.monotonic() + 3)
+    assert set(Path("/tmp").glob("vct-browser-*")) == profiles
+    print(json.dumps(dict(probe="stall", operation=operation, elapsed=elapsed,
+                          profiles_clean=True, deferred_cleanup=deferred)))
+
+
+@LINUX
+@pytest.mark.parametrize("output,expected", [("b'x'*(2_000_000+100_000)", "OUTPUT_LIMIT"),
+                                           ("b'{bad'", "INVALID_OUTPUT"),
+                                           ("b'[]'", "INVALID_OUTPUT"),
+                                           ("b'{\"code\":[]}'", "INVALID_OUTPUT"),
+                                           ("b'{\"code\":{}}'", "INVALID_OUTPUT")])
+def test_actual_bounded_malformed_output(monkeypatch, output, expected, cleanup_slot):
+    runner = f"import os,time; data={output}; os.write(1,data); time.sleep(.1)"
+    install_supervisor(monkeypatch, runner=runner)
+    received = []
+    original = browser.os.read
+    def bounded(fd, size):
+        chunk = original(fd, size)
+        received.append(len(chunk))
+        return chunk
+    monkeypatch.setattr(browser.os, "read", bounded)
+    assert attempt() == {"code": expected}
+    # Includes subprocess' empty exec-error-pipe receipt; no full output buffer.
+    assert sum(received) <= browser.MAX_BYTES + 1
+
+
+@LINUX
+def test_actual_stuck_cleanup_caps_backlog(monkeypatch, caplog, cleanup_slot):
+    install_supervisor(monkeypatch, setup="import time\ns._cleanup_profile=lambda p: time.sleep(12)",
+                       runner="print('{\"code\":\"NO_GAIN\"}')")
+    cleanup_original = browser._cleanup_command
+    monkeypatch.setattr(browser, "_cleanup_command", lambda directory:
+                        [sys.executable, "-c", "import time; time.sleep(12)"])
+    profiles = set(Path("/tmp").glob("vct-browser-*"))
+    preserve_attempt(caplog)
+    pending_directory = browser._pending_cleanup["directory"]
+    for _ in range(3):
+        assert attempt() == {"code": "RUNTIME_UNAVAILABLE"}
+        assert browser._pending_cleanup["directory"] == pending_directory
+        assert len(set(Path("/tmp").glob("vct-browser-*")) - profiles) == 1
+    monkeypatch.setattr(browser, "_cleanup_command", cleanup_original)
+    time.sleep(.05)
+    assert browser._drain_cleanup(time.monotonic() + 2)
+    assert set(Path("/tmp").glob("vct-browser-*")) == profiles
+
+
+@LINUX
+def test_actual_deferred_cleanup_recovers_through_normal_entry_and_gains(monkeypatch, caplog, cleanup_slot):
+    from hashlib import sha256
+    bootstrap = browser._bootstrap_command
+    cleanup = browser._cleanup_command
+    profiles = set(Path('/tmp').glob('vct-browser-*'))
+    # Healthy deletion needs 0.7 seconds, longer than the old repeated window.
+    def delayed_cleanup(directory):
+        command = cleanup(directory)
+        return [sys.executable, '-c',
+                "import runpy,sys,time;time.sleep(.7);sys.argv=sys.argv[1:];runpy.run_path(sys.argv[0],run_name='__main__')",
+                *command[1:]]
+    monkeypatch.setattr(browser, '_cleanup_command', delayed_cleanup)
+    install_supervisor(monkeypatch, setup='import time\ns._cleanup_profile=lambda p: time.sleep(12)',
+                       runner='print(\'{"code":"NO_GAIN"}\')')
+    preserve_attempt(caplog)
+    assert browser._pending_cleanup is not None
+    directory = browser._pending_cleanup['directory']
+    monkeypatch.setattr(browser, '_bootstrap_command', bootstrap)
+    original, html = extracted()
+    frozen = deepcopy(original)
+    started = time.monotonic()
+    selected = browser.maybe_render(original, html, html.encode(), enabled=True)
+    elapsed = time.monotonic() - started
+    assert elapsed < 11
+    assert selected['supplier_data']['extraction_method'] == 'PUBLIC_BROWSER', caplog.text
+    assert browser.field_count(selected['supplier_data']) > browser.field_count(original['supplier_data'])
+    assert browser.preserves(original['supplier_data'], selected['supplier_data'])
+    assert original == frozen
+    assert selected['raw_payload']['html_sha256'] == sha256(html.encode()).hexdigest()
+    assert len(selected['raw_payload']['rendered_html_sha256']) == 64
+    assert browser._pending_cleanup is None and not Path(directory).exists()
+    assert set(Path('/tmp').glob('vct-browser-*')) == profiles
+    print(json.dumps(dict(probe='automatic-cleanup-recovery', deletion_delay=.7, elapsed=elapsed,
+                          gained=True, original_http_preserved=True, profiles_clean=True)))
+
+
+def allocation_runner(marker, *, kernel=False):
+    # Instrument actual native main exception handling, not a fake finite code.
+    return f"""
+import os, resource, sys
+from pathlib import Path
+from backend.app.extraction import browser_runner as r
+async def allocate(request):
+ if not {kernel!r}: resource.setrlimit(resource.RLIMIT_AS, (256*1024**2,256*1024**2))
+ try:
+  data=bytearray({1200 if kernel else 384}*1024**2)
+  for i in range(0,len(data),4096): data[i]=1
+ except MemoryError:
+  Path({str(marker)!r}).write_text('MemoryError')
+  raise
+r.render=allocate
+r.main()
+"""
+
+
+@LINUX
+def test_actual_allocation_refusal_preserves_http(monkeypatch, tmp_path, caplog, cleanup_slot):
+    marker = tmp_path / "allocation-refused"
+    install_supervisor(monkeypatch, runner=allocation_runner(marker))
+    elapsed = preserve_attempt(caplog)
+    assert marker.read_text() == "MemoryError"
+    assert "code=RUNTIME_FAILED" in caplog.text
+    print(json.dumps(dict(probe="allocation-refusal", elapsed=elapsed, observed="MemoryError")))
+
+
+@LINUX
+@pytest.mark.skipif(os.getenv("VCT_TEST_BROWSER_OOM") != "true", reason="Destructive shared-cgroup OOM probe runs in a disposable container separately")
+def test_actual_kernel_oom_preserves_http(monkeypatch, tmp_path, caplog, cleanup_slot):
+    events = Path("/sys/fs/cgroup/memory.events")
+    def observed():
+        return dict((k, int(v)) for k, v in (line.split() for line in events.read_text().splitlines()))
+    before = observed()
+    install_supervisor(monkeypatch, runner=allocation_runner(tmp_path / "oom", kernel=True))
+    elapsed = preserve_attempt(caplog)
+    after = observed()
+    assert after["oom"] > before["oom"] and after["oom_kill"] > before["oom_kill"]
+    assert "code=RUNTIME_FAILED" in caplog.text or "code=DEADLINE" in caplog.text
+    print(json.dumps(dict(probe="kernel-oom", elapsed=elapsed,
+                          peak=Path("/sys/fs/cgroup/memory.peak").read_text().strip(),
+                          events_before=before, events_after=after, caller_survived=True)))
diff --git a/backend/tests/test_dom_visibility.py b/backend/tests/test_dom_visibility.py
new file mode 100644
--- /dev/null
+++ b/backend/tests/test_dom_visibility.py
@@ -0,0 +1,339 @@
+"""Screen visibility expectations independent of extraction implementation."""
+from hashlib import sha256
+
+import httpx
+import pytest
+
+from backend.app.extraction.browser import access_wall, maybe_render
+from backend.app.extraction.dom import active, prune_dom, stylesheet_hidden, tree
+from backend.tests.test_browser_fallback import ADAPTERS, fixture
+
+
+REPRODUCTIONS = [
+    ('<style>.wall{display:none}.wall{display:block}</style>', '<div class="wall">Please sign in</div>', 'AUTH_REQUIRED'),
+    ('', '<div style="display:none;display:block">Please sign in</div>', 'AUTH_REQUIRED'),
+    ('', '<div style="visibility:hidden">Invisible<span style="visibility:visible">Please sign in</span></div>', 'AUTH_REQUIRED'),
+    ('<style media="print">.wall{display:none}</style>', '<div class="wall">Please sign in</div>', 'AUTH_REQUIRED'),
+    ('<style>.wall{opacity:0%}</style>', '<div class="wall">Please sign in</div>', None),
+]
+
+
+def page(styles, body):
+    return '<html><head><title>Product</title>' + styles + '</head><body>' + body + '</body></html>'
+
+
+@pytest.mark.parametrize('styles,body,expected', REPRODUCTIONS)
+def test_recorded_screen_reproductions(styles, body, expected):
+    assert access_wall(page(styles, body)) == expected
+
+
+@pytest.mark.parametrize('styles,inline,expected', [
+    ('.wall{display:none}.wall{display:block}', '', 'AUTH_REQUIRED'),
+    ('.wall{display:none;display:inline list-item}', '', 'AUTH_REQUIRED'),
+    ('.wall{display:none;display:ruby}', '', 'AUTH_REQUIRED'),
+    ('.wall{display:ruby;display:none}', '', None),
+    ('.wall{display:none!important;display:ruby}', '', None),
+    ('.wall{display:none;display:ruby!important}', '', 'AUTH_REQUIRED'),
+    ('.wall{display:none}.wall{display:ruby}', '', 'AUTH_REQUIRED'),
+    ('.wall{display:ruby}.wall{display:none}', '', None),
+    ('.wall{display:none}', 'display:none;display:ruby', 'AUTH_REQUIRED'),
+    ('.wall{display:none!important;display:inline list-item}', '', None),
+    ('.wall{display:none}', 'display:inline list-item', 'AUTH_REQUIRED'),
+    ('.wall{display:block}.wall{display:none}', '', None),
+    ('#wall{display:block}.wall{display:none}', '', 'AUTH_REQUIRED'),
+    ('.wall{display:none}div{display:block}', '', None),
+    ('[id="wall"]{display:block}div{display:none}', '', 'AUTH_REQUIRED'),
+    ('body > .wall{display:block}.wall{display:none}', '', 'AUTH_REQUIRED'),
+    ('#irrelevant,.wall{display:none}body .wall{display:block}', '', 'AUTH_REQUIRED'),
+    ('#wall{display:none}', 'display:block', 'AUTH_REQUIRED'),
+    ('.wall{display:none!important}', 'display:block', None),
+    ('#wall{display:none!important}', 'display:block!important', 'AUTH_REQUIRED'),
+    ('.wall{display:block!important}#wall{display:none}', '', 'AUTH_REQUIRED'),
+    ('', 'display:none!important;display:block', None),
+    ('', 'display:none;display:block!important', 'AUTH_REQUIRED'),
+    ('', 'display:none!important;display:block!important', 'AUTH_REQUIRED'),
+    ('', 'display:none;display:invalid', None),
+    ('', 'display:/**/none;display:block', 'AUTH_REQUIRED'),
+    ('.wall{display:none!important;display:block}', '', None),
+    ('.wall{display:none;display:invalid}', '', None),
+    ('.wall{display:none}#wall{DISPLAY:BLOCK ! IMPORTANT}', '', 'AUTH_REQUIRED'),
+    ('.wall{visibility:hidden}#wall{visibility:visible}', '', 'AUTH_REQUIRED'),
+    ('.wall{opacity:0}#wall{opacity:1}', '', 'AUTH_REQUIRED'),
+    ('.wall{opacity:0!important}', 'opacity:100%', None),
+])
+def test_cascade_priority(styles, inline, expected):
+    html = page('<style>' + styles + '</style>', '<div id="wall" class="wall" style="' + inline + '">Please sign in</div>')
+    assert access_wall(html) == expected
+
+
+@pytest.mark.parametrize('parent,child,expected', [
+    ('visibility:hidden', 'visibility:visible', 'AUTH_REQUIRED'),
+    ('visibility:collapse', 'visibility:visible', 'AUTH_REQUIRED'),
+    ('visibility:hidden', 'visibility:initial', 'AUTH_REQUIRED'),
+    ('visibility:hidden', 'visibility:inherit', None),
+    ('visibility:hidden', 'visibility:unset', None),
+    ('visibility:hidden', '', None),
+    ('display:none', 'display:block;visibility:visible', None),
+    ('opacity:0', 'opacity:1;visibility:visible', None),
+    ('opacity:0%', 'opacity:100%', None),
+    ('opacity:0.5', 'opacity:inherit', 'AUTH_REQUIRED'),
+    ('opacity:0.5', 'opacity:0', None),
+])
+def test_inheritance_and_subtree_suppression(parent, child, expected):
+    body = '<div style="' + parent + '">Hidden own text<span style="' + child + '">Please sign in</span></div>'
+    assert access_wall(page('', body)) == expected
+
+
+@pytest.mark.parametrize('opacity', ['0', '0.0', '.0', '0%', '0.00%', '+0', '-1', '-10%', '0 !important'])
+def test_zero_opacity_has_no_barrier_or_selected_text(opacity):
+    html = page('<style>.wall{opacity:' + opacity + '}</style>', '<div class="wall">Captcha</div><p>Public text</p>')
+    parsed = tree(html)
+    stylesheet_hidden(parsed)
+    prune_dom(parsed)
+    assert parsed.body.text(strip=True) == 'Public text'
+    assert access_wall(html) is None
+
+
+@pytest.mark.parametrize('styles', [
+    '<style media="print">.wall{display:none}</style>',
+    '<style media="PRINT">.wall{display:none}</style>',
+    '<style media="speech">.wall{display:none}</style>',
+    '<style type="text/plain">.wall{display:none}</style>',
+    '<style>@media print {.wall{display:none}}</style>',
+    '<style>@supports(display:block){.wall{display:none}}</style>',
+    '<style>@keyframes disappear{from{opacity:0}to{opacity:1}}</style>',
+    '<style>.wall:hover{display:none}</style>',
+    '<link rel="stylesheet" href="https://external.invalid/style.css">',
+])
+def test_unsupported_or_non_screen_styles_do_not_hide_screen_text(styles):
+    assert access_wall(page(styles, '<div class="wall">Please sign in</div>')) == 'AUTH_REQUIRED'
+
+
+@pytest.mark.parametrize('styles', [
+    '<style media="screen">.wall{display:none}</style>',
+    '<style media="all">.wall{display:none}</style>',
+    '<style media="print, screen">.wall{display:none}</style>',
+    '<style>.wall{display:none}</style>',
+])
+def test_supported_screen_styles_hide_text(styles):
+    assert access_wall(page(styles, '<div class="wall">Captcha</div>')) is None
+
+
+def test_hidden_ancestor_keeps_visible_descendants_and_ignores_own_text():
+    parsed = tree(page('<style>.parent{visibility:hidden}.visible{visibility:visible}</style>',
+        '<div class="parent">Captcha<span>Hidden</span><b class="visible">Public</b>Tail</div>'))
+    stylesheet_hidden(parsed)
+    assert not active(parsed.css_first('.parent'))
+    assert active(parsed.css_first('.visible'))
+    prune_dom(parsed)
+    assert parsed.body.text(strip=True) == 'Public'
+    prune_dom(parsed)
+    assert parsed.body.text(strip=True) == 'Public'
+
+
+@pytest.mark.parametrize('attribute', ['hidden', 'aria-hidden="true"'])
+def test_explicit_hidden_attributes_suppress_visible_children(attribute):
+    assert access_wall(page('', '<div ' + attribute + '><span style="visibility:visible">Captcha</span></div>')) is None
+
+
+@pytest.mark.parametrize('styles', [
+    '.wall {display: none; broken; display: block}',
+    '.wall[data-label="unclosed] {display:none}',
+    '.wall {display:unknown; opacity:invalid; visibility:bogus}',
+    '.wall' + '(' * 1500 + ')' * 1500 + '{display:none}',
+    '.wall[data-label=' + '[' * 1500 + ']' * 1500 + '] {display:none}',
+])
+def test_malformed_or_unsupported_css_has_a_finite_outcome(styles):
+    assert access_wall(page('<style>' + styles + '</style>', '<div class="wall">Please sign in</div>')) == 'AUTH_REQUIRED'
+
+
+def test_pruning_suppressed_document_is_repeatable():
+    parsed = tree('<html style="display:none"><body>Captcha</body></html>')
+    prune_dom(parsed)
+    prune_dom(parsed)
+    assert not parsed.css('body')
+
+
+@pytest.mark.parametrize('platform', ADAPTERS)
+@pytest.mark.parametrize('styles,body,expected', REPRODUCTIONS)
+def test_sparse_adapter_access_outcomes_have_no_supplier_snapshot(platform, styles, body, expected):
+    source, _ = fixture(platform)
+    adapter, parser = ADAPTERS[platform]
+    html = page(styles, body)
+    parsed = parser(html, source)
+    with httpx.Client(transport=httpx.MockTransport(lambda _: httpx.Response(200, headers={'content-type': 'text/html'}, text=html))) as client:
+        fetched = adapter(source, client=client, dns_check=lambda _: True)
+    for result in (parsed, fetched):
+        assert result['extraction_status'] == (expected or 'PARSE_FAILED')
+        assert 'supplier_data' not in result and 'raw_payload' not in result
+
+
+@pytest.mark.parametrize('platform', ADAPTERS)
+@pytest.mark.parametrize('styles,body,expected', REPRODUCTIONS)
+def test_fallback_access_and_failure_preserve_http_evidence(platform, styles, body, expected):
+    source, html = fixture(platform)
+    original = ADAPTERS[platform][1](html, source)
+    html = html.replace('</head>', styles + '</head>').replace('<body>', '<body>' + body)
+    calls = []
+    def fail_renderer(*args):
+        calls.append(args)
+        return {'code': 'RUNTIME_FAILED'}
+    result = maybe_render(original, html, html.encode(), enabled=True, renderer=fail_renderer)
+    if expected:
+        assert result['extraction_status'] == expected
+        assert 'supplier_data' not in result and 'raw_payload' not in result
+        assert not calls
+    else:
+        assert result is original
+        assert len(calls) == 1
+
+
+@pytest.mark.parametrize('platform', ADAPTERS)
+@pytest.mark.parametrize('hidden', [False, True])
+def test_selected_dom_fields_and_original_hash_follow_visibility(platform, hidden):
+    source, html = fixture(platform, render=False)
+    if platform == '1688':
+        evidence = '<div class="review-item"><span class="selected">Public review</span></div>'
+        field = 'reviews'
+    elif platform == 'TAOBAO':
+        evidence = '<div class="shopProductShelfArea--test"><div class="shop-item-card"><a href="https://item.taobao.com/item.htm?id=777"><span class="title--test selected">Public product</span></a></div></div>'
+        field = 'products'
+    else:
+        evidence = '<div class="product-review"><div class="product-review-list"><div class="r-relative r-whitespace-normal selected">Public review</div></div></div>'
+        field = 'reviews'
+    rule = '.selected{opacity:0%}' if hidden else '.selected{visibility:hidden}.selected{visibility:visible}'
+    html = html.replace('</head>', '<style>' + rule + '</style></head>').replace('</body>', evidence + '</body>')
+    adapter, parser = ADAPTERS[platform]
+    result = parser(html, source)
+    assert result['extraction_status'] == 'PARTIAL'
+    if platform == 'TAOBAO':
+        # The product link is visible even when its title is transparent.
+        assert result['supplier_data'][field] == [{
+            'offer_id': '777', 'title': None if hidden else 'Public product',
+            'source_url': 'https://item.taobao.com/item.htm?id=777',
+        }]
+    else:
+        assert bool(result['supplier_data'][field]) is not hidden
+    with httpx.Client(transport=httpx.MockTransport(lambda _: httpx.Response(200, headers={'content-type': 'text/html; charset=utf-8'}, content=html.encode()))) as client:
+        fetched = adapter(source, client=client, dns_check=lambda _: True)
+    assert fetched['supplier_data'][field] == result['supplier_data'][field]
+    assert fetched['raw_payload']['html_sha256'] == sha256(html.encode()).hexdigest()
+
+
+@pytest.mark.parametrize('property,hidden', [('display', 'none'), ('visibility', 'hidden'), ('opacity', '0')])
+@pytest.mark.parametrize('placement', ['stylesheet', 'inline'])
+@pytest.mark.parametrize('important', ['', '!important'])
+def test_author_revert_supersedes_author_hiding(property, hidden, placement, important):
+    declarations = f'{property}:{hidden}{important};{property}:revert{important}'
+    styles = '<style>.wall{' + declarations + '}</style>' if placement == 'stylesheet' else ''
+    inline = declarations if placement == 'inline' else ''
+    assert access_wall(page(styles, '<p class="wall" style="' + inline + '">Please sign in</p>')) == 'AUTH_REQUIRED'
+
+
+@pytest.mark.parametrize('property,hidden,expected', [('display', 'none', None), ('visibility', 'hidden', None), ('opacity', '0', None)])
+def test_revert_cannot_override_important_hiding(property, hidden, expected):
+    assert access_wall(page('<style>.wall{' + property + ':' + hidden + '!important}</style>',
+        '<p class="wall" style="' + property + ':revert">Please sign in</p>')) == expected
+
+
+@pytest.mark.parametrize('placement', ['stylesheet', 'inline'])
+@pytest.mark.parametrize('parent,expected', [('hidden', None), ('visible', 'AUTH_REQUIRED')])
+def test_visibility_revert_inherits_after_author_rollback(placement, parent, expected):
+    declarations = 'visibility:visible!important;visibility:revert!important'
+    styles = '<style>.wall{' + declarations + '}</style>' if placement == 'stylesheet' else ''
+    inline = declarations if placement == 'inline' else ''
+    assert access_wall(page(styles, '<div style="visibility:' + parent + '"><p class="wall" style="' + inline + '">Please sign in</p></div>')) == expected
+
+
+@pytest.mark.parametrize('link_style,title_style,selected,title', [
+    ('visibility:hidden', '', False, None),
+    ('visibility:hidden', 'visibility:visible', True, 'Public product'),
+    ('', 'visibility:hidden', True, None),
+    ('display:none', 'visibility:visible', False, None),
+    ('opacity:0', 'visibility:visible', False, None),
+])
+def test_taobao_shop_selects_only_visible_links_or_restored_descendants(link_style, title_style, selected, title):
+    source, html = fixture('TAOBAO', render=False)
+    evidence = ('<div class="shopProductShelfArea--test"><div class="shop-item-card">'
+                '<a style="' + link_style + '" href="https://item.taobao.com/item.htm?id=777">'
+                '<span class="title--test" style="' + title_style + '">Public product</span></a></div></div>')
+    html = html.replace('</body>', evidence + '</body>')
+    result = ADAPTERS['TAOBAO'][1](html, source)
+    expected = [{'offer_id': '777', 'title': title, 'source_url': 'https://item.taobao.com/item.htm?id=777'}]
+    assert result['extraction_status'] == 'PARTIAL'
+    assert result['supplier_data']['products'] == (expected if selected else None)
+    assert result['raw_payload']['public_fields']['products'] == (expected if selected else [])
+    assert ('products' in result['supplier_data']['missing_fields']) is not selected
+    assert result['raw_payload']['html_sha256'] == sha256(html.encode()).hexdigest()
+
+
+@pytest.mark.parametrize('style,expected', [('', 'AUTH_REQUIRED'), ('visibility:hidden', 'PARSE_FAILED'), ('opacity:0', 'PARSE_FAILED'), ('display:none', 'PARSE_FAILED')])
+def test_alibaba_password_access_classification_requires_visible_control(style, expected):
+    source, _ = fixture('ALIBABA', render=False)
+    html = page('', '<form><input type="password" style="' + style + '"></form>')
+    result = ADAPTERS['ALIBABA'][1](html, source)
+    assert result['extraction_status'] == expected
+    assert 'supplier_data' not in result and 'raw_payload' not in result
+
+
+@pytest.mark.parametrize('hidden_field', ['supplier_name', 'products'])
+@pytest.mark.parametrize('style', ['visibility:hidden', 'opacity:0%', 'display:none'])
+def test_model_free_1688_hidden_headings_are_absent_from_normalized_and_raw_evidence(hidden_field, style):
+    source, _ = fixture('1688', render=False)
+    supplier_style = style if hidden_field == 'supplier_name' else ''
+    title_style = style if hidden_field == 'products' else ''
+    html = page('', f'<link rel="canonical" href="{source}">'
+        f'<div class="shop-company-name"><h1 style="{supplier_style}">Public supplier</h1></div>'
+        f'<div class="title-content"><h1 style="{title_style}">Public product</h1></div>')
+    result = ADAPTERS['1688'][1](html, source)
+    data, raw = result['supplier_data'], result['raw_payload']
+    assert result['extraction_status'] == 'PARTIAL'
+    assert data[hidden_field] is None and hidden_field in data['missing_fields']
+    assert data['completeness'] == round(1 / 12, 4)
+    assert len(data['missing_fields']) == 11
+    assert data['supplier_name'] == (None if hidden_field == 'supplier_name' else 'Public supplier')
+    assert data['products'] == (None if hidden_field == 'products' else [{'offer_id': '987654321012', 'title': 'Public product'}])
+    assert raw['public_fields']['title'] == (None if hidden_field == 'products' else 'Public product')
+    assert all(value is None for value in raw['public_fields']['shop_info'].values())
+    assert raw['html_sha256'] == sha256(html.encode()).hexdigest()
+
+
+@pytest.mark.parametrize('rules,expected', [
+    ('[data-x="]"]{display:none}', None),
+    ('[data-x="]"]{display:none}p{display:block}', None),
+    ('[data-x="]"]{display:none}[data-x="]"]{display:block}', 'AUTH_REQUIRED'),
+    ('[data-x="]"]{display:none}p{display:block!important}', 'AUTH_REQUIRED'),
+])
+def test_quoted_bracket_selector_keeps_specificity_priority_and_order(rules, expected):
+    assert access_wall(page('<style>' + rules + '</style>', '<p data-x="]">Please sign in</p>')) == expected
+
+
+@pytest.mark.parametrize('platform', ADAPTERS)
+@pytest.mark.parametrize('rules,selected', [
+    ('[data-x="]"]{display:none}', False),
+    ('[data-x="]"]{display:none}[data-x="]"]{display:inline list-item}', True),
+    ('[data-x="]"]{display:none!important}[data-x="]"]{display:inline list-item}', False),
+    ('[data-x="]"]{display:none;display:ruby}', True),
+    ('[data-x="]"]{display:ruby;display:none}', False),
+    ('[data-x="]"]{display:none!important;display:ruby}', False),
+    ('[data-x="]"]{display:none;display:ruby!important}', True),
+])
+def test_supported_css_corrections_control_selected_evidence_and_original_hash(platform, rules, selected):
+    source, html = fixture(platform, render=False)
+    if platform == '1688':
+        evidence, field = '<p class="review-item" data-x="]">Public review</p>', 'reviews'
+    elif platform == 'TAOBAO':
+        evidence, field = ('<div class="shopProductShelfArea--test"><div class="shop-item-card">'
+            '<a data-x="]" href="https://item.taobao.com/item.htm?id=777">'
+            '<span class="title--test">Public product</span></a></div></div>'), 'products'
+    else:
+        evidence, field = ('<div class="product-review"><div class="product-review-list">'
+            '<div class="r-relative r-whitespace-normal" data-x="]">Public review</div></div></div>'), 'reviews'
+    html = html.replace('</head>', '<style>' + rules + '</style></head>').replace('</body>', evidence + '</body>')
+    result = ADAPTERS[platform][1](html, source)
+    assert result['extraction_status'] == 'PARTIAL'
+    data, raw = result['supplier_data'], result['raw_payload']
+    assert bool(data[field]) is selected
+    assert bool(raw['public_fields']['review_bodies' if platform == 'ALIBABA' else field]) is selected
+    assert (field in data['missing_fields']) is not selected
+    assert raw['html_sha256'] == sha256(html.encode()).hexdigest()
diff --git a/backend/tests/test_response_limits.py b/backend/tests/test_response_limits.py
new file mode 100644
--- /dev/null
+++ b/backend/tests/test_response_limits.py
@@ -0,0 +1,369 @@
+"""Independent transport regressions: inspect output allocations, not just rejection."""
+from hashlib import sha256
+from datetime import datetime, timezone
+from pathlib import Path
+from unittest.mock import patch
+import gzip
+import zlib
+
+import httpx
+import pytest
+
+from backend.app.extraction import (
+    extract_1688, extract_taobao, extract_alibaba,
+    parse_1688_page, parse_taobao_page, parse_alibaba_page,
+)
+from backend.app.extraction import fetch
+
+
+URL = "https://detail.1688.com/offer/996518024136.html"
+HTML = (f'<link rel="canonical" href="{URL}">'
+        '<div class="title-content"><h1>Dress</h1></div>').encode()
+LAYOUTS = {
+    "1688_offer": (extract_1688, parse_1688_page, "1688_offer_996518024136.html", URL),
+    "taobao_item": (extract_taobao, parse_taobao_page, "taobao_item_1076425861755.html", "https://item.taobao.com/item.htm?id=1076425861755"),
+    "taobao_shop": (extract_taobao, parse_taobao_page, "taobao_shop_159450000.html", "https://shop159450000.world.taobao.com/category.htm"),
+    "alibaba_product": (extract_alibaba, parse_alibaba_page, "alibaba_product_1600147809763.html", "https://www.alibaba.com/product-detail/100-Cotton-180gsm-T-shirts-Men_1600147809763.html"),
+    "alibaba_profile": (extract_alibaba, parse_alibaba_page, "alibaba_profile_dgxuandele.html", "https://dgxuandele.en.alibaba.com/company_profile.html"),
+}
+
+
+class FixedDatetime(datetime):
+    @classmethod
+    def now(cls, tz=None):
+        return datetime(2026, 10, 3, tzinfo=timezone.utc).astimezone(tz)
+
+
+def encode(content, encoding):
+    if encoding == "gzip":
+        return gzip.compress(content)
+    if encoding == "deflate":
+        return zlib.compress(content)
+    if encoding == "raw-deflate":
+        compressor = zlib.compressobj(wbits=-zlib.MAX_WBITS)
+        return compressor.compress(content) + compressor.flush()
+    return content
+
+
+class Stream(httpx.SyncByteStream):
+    def __init__(self, chunks, before=None):
+        self.chunks = chunks
+        self.before = before or (lambda: None)
+        self.closed = False
+        self.reads = 0
+
+    def __iter__(self):
+        for chunk in self.chunks:
+            self.before()
+            self.reads += 1
+            yield chunk
+
+    def close(self):
+        self.closed = True
+
+
+def extract(stream, encoding="identity", **kwargs):
+    calls = []
+
+    def respond(request):
+        calls.append(request)
+        return httpx.Response(200, headers={"content-type": "text/html; charset=utf-8",
+                                           "content-encoding": encoding}, stream=stream)
+
+    with httpx.Client(transport=httpx.MockTransport(respond)) as client:
+        result = extract_1688(URL, client=client, dns_check=lambda _: True, **kwargs)
+    return result, calls
+
+
+@pytest.fixture
+def allocations(monkeypatch):
+    """Observe both HTTPX's old decoder and the replacement at the zlib boundary."""
+    factory = zlib.decompressobj
+    records = []
+
+    class Observed:
+        def __init__(self, *args, **kwargs):
+            self.decoder = factory(*args, **kwargs)
+
+        def decompress(self, data, max_length=0):
+            output = self.decoder.decompress(data, max_length)
+            records.append((max_length, len(output)))
+            return output
+
+        def flush(self, *args):
+            output = self.decoder.flush(*args)
+            records.append((0, len(output)))
+            return output
+
+        def __getattr__(self, name):
+            return getattr(self.decoder, name)
+
+    monkeypatch.setattr(zlib, "decompressobj", Observed)
+    return records
+
+
+@pytest.mark.parametrize("encoding", ["gzip", "deflate", "raw-deflate"])
+@pytest.mark.parametrize("fragmented", [False, True])
+def test_compressed_bomb_bounds_every_output_allocation_and_total(encoding, fragmented, allocations):
+    wire = encode(b"x" * (fetch.MAX_HTML_BYTES * 16), encoding)
+    chunks = [wire[i:i + 113] for i in range(0, len(wire), 113)] if fragmented else [wire]
+    stream = Stream(chunks)
+    result, calls = extract(stream, "deflate" if encoding == "raw-deflate" else encoding)
+    assert result == {"source_url": URL, "extraction_status": "PARSE_FAILED", "reason": "PAGE_TOO_LARGE"}
+    assert stream.closed and len(calls) == 1
+    assert allocations
+    # One overflow byte distinguishes an exact-cap page from one exceeding it.
+    assert sum(size for _, size in allocations) <= fetch.MAX_DECODED_BYTES
+    produced = 0
+    for maximum, size in allocations:
+        assert 0 < maximum <= min(65536, fetch.MAX_HTML_BYTES - produced + 1)
+        assert size <= maximum
+        produced += size
+
+
+@pytest.mark.parametrize("encoding", ["identity", "gzip", "deflate", "raw-deflate"])
+@pytest.mark.parametrize("delta", [-1, 0, 1])
+def test_incremental_exact_capacity_and_one_byte_overflow(encoding, delta):
+    body = HTML + b" " * (fetch.MAX_HTML_BYTES + delta - len(HTML))
+    wire = encode(body, encoding)
+    # Split headers and trailers as well as the compressed payload.
+    stream = Stream([wire[i:i + 17] for i in range(0, len(wire), 17)])
+    result, calls = extract(stream, "deflate" if encoding == "raw-deflate" else encoding)
+    assert stream.closed and len(calls) == 1
+    if delta > 0:
+        assert result == {"source_url": URL, "extraction_status": "PARSE_FAILED", "reason": "PAGE_TOO_LARGE"}
+    else:
+        assert result["extraction_status"] == "PARTIAL"
+        assert result["raw_payload"]["html_sha256"] == sha256(body).hexdigest()
+
+
+@pytest.mark.parametrize("encoding", ["identity", "gzip", "deflate", "raw-deflate"])
+@pytest.mark.parametrize("layout", LAYOUTS)
+@pytest.mark.parametrize("pre_read", [False, True])
+def test_audited_pages_keep_selected_fields_and_decoded_hashes(layout, encoding, pre_read):
+    extractor, parser, filename, url = LAYOUTS[layout]
+    body = (Path(__file__).parent / "fixtures" / filename).read_bytes()
+    wire = encode(body, encoding)
+    headers = {"content-type": "text/html; charset=utf-8",
+               "content-encoding": "deflate" if encoding == "raw-deflate" else encoding}
+    with patch(parser.__module__ + ".datetime", FixedDatetime):
+        byte_argument = {"uploaded_bytes": body} if layout == "1688_offer" else {"page_bytes": body}
+        expected = parser(body.decode(), url, **byte_argument)
+
+        def respond(_):
+            if pre_read:
+                return httpx.Response(200, headers=headers, content=wire)
+            return httpx.Response(200, headers=headers,
+                                  stream=Stream([wire[i:i + 101] for i in range(0, len(wire), 101)]))
+
+        with httpx.Client(transport=httpx.MockTransport(respond)) as client:
+            result = extractor(url, client=client, dns_check=lambda _: True)
+    assert result == expected
+    assert result["raw_payload"]["html_sha256"] == sha256(body).hexdigest()
+
+
+@pytest.mark.parametrize(("encoding", "damage"), [
+    (encoding, damage)
+    for encoding in ("gzip", "deflate", "raw-deflate")
+    for damage in ("invalid", "truncated", "junk")
+] + [("gzip", "checksum"), ("deflate", "checksum")])
+def test_malformed_compression_has_no_snapshot_or_retry(encoding, damage):
+    wire = encode(HTML, encoding)
+    if damage == "invalid":
+        wire = b"not a compressed HTML page"
+    elif damage == "truncated":
+        wire = wire[:-1]
+    elif damage == "junk":
+        wire += b"junk"
+    else:
+        wire = wire[:-1] + bytes([wire[-1] ^ 255])
+    stream = Stream([wire[:1], wire[1:]])
+    result, calls = extract(stream, "deflate" if encoding == "raw-deflate" else encoding)
+    assert result == {"source_url": URL, "extraction_status": "PARSE_FAILED", "reason": "HTTP_ERROR"}
+    assert stream.closed and len(calls) == 1
+
+
+@pytest.mark.parametrize("encoding", ["br", "zstd", "compress", "gzip, deflate", "identity, gzip"])
+def test_unsupported_codings_fail_before_reading(encoding):
+    stream = Stream([HTML])
+    result, calls = extract(stream, encoding)
+    assert result == {"source_url": URL, "extraction_status": "PARSE_FAILED", "reason": "HTTP_ERROR"}
+    assert stream.closed and stream.reads == 0 and len(calls) == 1
+
+
+def test_concatenated_gzip_members_share_one_budget(allocations):
+    stream = Stream([gzip.compress(b"x" * (fetch.MAX_HTML_BYTES // 2)),
+                     gzip.compress(b"y" * fetch.MAX_HTML_BYTES)])
+    result, calls = extract(stream, "gzip")
+    assert result["reason"] == "PAGE_TOO_LARGE" and len(calls) == 1 and stream.closed
+    assert sum(size for _, size in allocations) <= fetch.MAX_HTML_BYTES + 1
+
+
+def test_valid_concatenated_gzip_members_hash_complete_decoded_body():
+    stream = Stream([gzip.compress(HTML[:45]), gzip.compress(HTML[45:])])
+    result, _ = extract(stream, "gzip")
+    assert result["extraction_status"] == "PARTIAL"
+    assert result["raw_payload"]["html_sha256"] == sha256(HTML).hexdigest()
+
+
+@pytest.mark.parametrize("fragment", [1, 2, 5, 17, 1000])
+def test_raw_stored_block_with_zlib_header_replays_before_first_output(fragment, allocations):
+    body = HTML + b" " * (156 - len(HTML))
+    wire = b"\x78\x9c\x00\x63\xff" + body + b"\x01\x00\x00\xff\xff"
+    assert zlib.decompress(wire, -zlib.MAX_WBITS) == body
+    result, calls = extract(Stream([wire[i:i + fragment] for i in range(0, len(wire), fragment)]), "deflate")
+    assert result["extraction_status"] == "PARTIAL" and len(calls) == 1
+    assert result["raw_payload"]["html_sha256"] == sha256(body).hexdigest()
+    assert sum(size for _, size in allocations) <= fetch.MAX_DECODED_BYTES
+    assert all(0 < maximum <= fetch.DECODE_CHUNK_BYTES and size <= maximum for maximum, size in allocations)
+
+
+def test_wrapped_checksum_failure_after_accepted_output_never_replays(monkeypatch):
+    factory = zlib.decompressobj
+    modes = []
+    def observed(mode):
+        modes.append(mode)
+        return factory(mode)
+    monkeypatch.setattr(zlib, "decompressobj", observed)
+    wire = zlib.compress(HTML)
+    result, calls = extract(Stream([wire[:-4], b"\0\0\0\0"]), "deflate")
+    assert result == {"source_url": URL, "extraction_status": "PARSE_FAILED", "reason": "HTTP_ERROR"}
+    assert modes == [zlib.MAX_WBITS] and len(calls) == 1
+
+
+def test_deflate_undecided_wire_replay_has_explicit_capacity():
+    # Arbitrarily many empty nonfinal stored blocks are valid, but retaining
+    # an unbounded undecided prefix is outside the bounded fallback boundary.
+    wire = b"\x78\x9c" + b"\x00\x00\x00\xff\xff" * (fetch.DEFLATE_REPLAY_BYTES // 5 + 1)
+    stream = Stream([wire, b"unread"])
+    result, calls = extract(stream, "deflate")
+    assert result == {"source_url": URL, "extraction_status": "PARSE_FAILED", "reason": "HTTP_ERROR"}
+    assert stream.reads == 1 and stream.closed and len(calls) == 1
+
+
+def test_decoding_checks_deadline_between_output_chunks(monkeypatch, allocations):
+    now = [0.0]
+    factory = zlib.decompressobj
+
+    class Slow:
+        def __init__(self, *args, **kwargs):
+            self.decoder = factory(*args, **kwargs)
+
+        def decompress(self, *args, **kwargs):
+            result = self.decoder.decompress(*args, **kwargs)
+            now[0] += 26
+            return result
+
+        def __getattr__(self, name):
+            return getattr(self.decoder, name)
+
+    monkeypatch.setattr(zlib, "decompressobj", Slow)
+    stream = Stream([gzip.compress(HTML + b" " * 100000)])
+    result, calls = extract(stream, "gzip", clock=lambda: now[0], sleep=lambda _: pytest.fail("no retry"))
+    assert result == {"source_url": URL, "extraction_status": "TIMEOUT", "reason": "HTTP_TIMEOUT"}
+    assert len(calls) == 1 and stream.closed and len(allocations) == 1
+
+
+@pytest.mark.parametrize("encoding", ["gzip", "deflate"])
+@pytest.mark.parametrize("layout", LAYOUTS)
+def test_size_rejection_never_parses_or_starts_browser(layout, encoding):
+    extractor, parser, _, url = LAYOUTS[layout]
+    stream = Stream([encode(HTML + b" " * fetch.MAX_HTML_BYTES, encoding)])
+    with patch(parser.__module__ + "." + parser.__name__, side_effect=AssertionError("must not parse")):
+        with httpx.Client(transport=httpx.MockTransport(lambda _: httpx.Response(
+                200, headers={"content-type": "text/html", "content-encoding": encoding}, stream=stream))) as client:
+            result = extractor(url, client=client, dns_check=lambda _: True, browser_fallback=True,
+                               browser_renderer=lambda *_: pytest.fail("must not render"))
+    assert result == {"source_url": url, "extraction_status": "PARSE_FAILED", "reason": "PAGE_TOO_LARGE"}
+    assert stream.closed
+
+
+@pytest.mark.parametrize("encoding", ["gzip", "deflate", "raw-deflate"])
+@pytest.mark.parametrize("charset", ["meta", "mime"])
+def test_compressed_taobao_preserves_gbk_fields_and_response_byte_hash(encoding, charset):
+    _, parser, filename, url = LAYOUTS["taobao_shop"]
+    html = (Path(__file__).parent / "fixtures" / filename).read_text(encoding="utf-8")
+    html = html.replace('charset="utf-8"', 'charset="GBK"' if charset == "meta" else "")
+    body = html.encode("gb18030")
+    wire = encode(body, encoding)
+    headers = {"content-type": "text/html" + ("; charset=GBK" if charset == "mime" else ""),
+               "content-encoding": "deflate" if encoding == "raw-deflate" else encoding}
+    with patch(parser.__module__ + ".datetime", FixedDatetime):
+        expected = parser(html, url, page_bytes=body)
+        with httpx.Client(transport=httpx.MockTransport(lambda _: httpx.Response(
+                200, headers=headers, stream=Stream([wire[:1], wire[1:]])))) as client:
+            result = extract_taobao(url, client=client, dns_check=lambda _: True)
+    assert result == expected
+    assert result["supplier_data"]["supplier_name"] == "心相印维达生活馆"
+    assert result["raw_payload"]["html_sha256"] == sha256(body).hexdigest()
+
+
+@pytest.mark.parametrize("encoding", ["gzip", "deflate"])
+def test_compressed_retry_discards_partial_body_and_closes_before_backoff(encoding):
+    wire = encode(HTML, encoding)
+
+    def partial():
+        yield wire[:-1]
+        raise httpx.ReadError("source diagnostic must not escape")
+
+    streams = [Stream(partial()), Stream([wire])]
+    calls, delays = [], []
+
+    def respond(request):
+        stream = streams[len(calls)]
+        calls.append(request)
+        return httpx.Response(200, headers={"content-type": "text/html", "content-encoding": encoding}, stream=stream)
+
+    def sleep(delay):
+        assert streams[0].closed
+        delays.append(delay)
+
+    with httpx.Client(transport=httpx.MockTransport(respond)) as client:
+        result = extract_1688(URL, client=client, dns_check=lambda _: True, sleep=sleep)
+    assert result["extraction_status"] == "PARTIAL"
+    assert result["raw_payload"]["html_sha256"] == sha256(HTML).hexdigest()
+    assert delays == [0.5] and len(calls) == 2 and all(stream.closed for stream in streams)
+
+
+@pytest.mark.parametrize("encoding", ["gzip", "deflate"])
+@pytest.mark.parametrize("status", [200, 503])
+@pytest.mark.parametrize(("html", "status_name", "reason"), [
+    (b"<title>Captcha</title>", "BLOCKED", "ACCESS_CHALLENGE"),
+    (b"<title>Login required</title>", "AUTH_REQUIRED", "LOGIN_REQUIRED"),
+])
+def test_compressed_access_walls_keep_finite_outcomes_without_retries(encoding, status, html, status_name, reason):
+    stream = Stream([encode(html, encoding)])
+    with httpx.Client(transport=httpx.MockTransport(lambda _: httpx.Response(
+            status, headers={"content-type": "text/html", "content-encoding": encoding}, stream=stream))) as client:
+        result = extract_1688(URL, client=client, dns_check=lambda _: True,
+                              sleep=lambda _: pytest.fail("must not retry access wall"))
+    assert result == {"source_url": URL, "extraction_status": status_name, "reason": reason}
+    assert stream.closed
+
+
+@pytest.mark.parametrize('layout', ['1688_offer', 'taobao_item', 'alibaba_product'])
+@pytest.mark.parametrize('preferred', ['gzip', 'deflate'])
+def test_default_client_negotiates_only_supported_compression_and_preserves_selected_evidence(monkeypatch, layout, preferred):
+    adapter, parser, filename, url = LAYOUTS[layout]
+    body = (Path(__file__).parent / 'fixtures' / filename).read_bytes()
+    requests, streams = [], []
+    def respond(request):
+        requests.append(request)
+        advertised = {value.strip() for value in request.headers['accept-encoding'].split(',')}
+        # Select from the real outgoing header; advertising an unsupported
+        # encoding changes the response and must fail this production-path gate.
+        encoding = next((value for value in ('br', 'zstd', preferred, 'gzip', 'deflate') if value in advertised), 'identity')
+        stream = Stream([encode(body, encoding)])
+        streams.append(stream)
+        return httpx.Response(200, headers={'content-type': 'text/html; charset=utf-8',
+                                          'content-encoding': encoding}, stream=stream)
+    monkeypatch.setattr(fetch, '_public_transport', lambda **kwargs: httpx.MockTransport(respond))
+    with patch(parser.__module__ + '.datetime', FixedDatetime):
+        byte_argument = {'uploaded_bytes': body} if layout == '1688_offer' else {'page_bytes': body}
+        expected = parser(body.decode('utf-8'), url, **byte_argument)
+        result = adapter(url, dns_check=lambda _: True)
+    assert len(requests) == 1
+    assert {value.strip() for value in requests[0].headers['accept-encoding'].split(',')} == {'gzip', 'deflate'}
+    assert result == expected
+    assert result['raw_payload']['html_sha256'] == sha256(body).hexdigest()
+    assert all(stream.closed for stream in streams)
`. Read that file — it is the change under review.

Your task is strictly descriptive — do not prescribe additional work. Report: (1) the defensible readings of the intent, enumerated; (2) which reading this diff implements; (3) where the readings and the diff diverge — specifically, which surface the intent's expectations live at versus which surface the diff's changes and its tests exercise.

Do not invoke any skill, and do not spawn subagents of your own — you are the reviewer. Return your findings as text in your final message; do not route them through any findings-reporting tool the host may offer.
