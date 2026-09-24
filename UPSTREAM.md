# KillMyIdea integration

Source: https://github.com/monteduro/killmyidea
Revision: bc853421f2eb6f17da435621896dd6cd881a051c

The files in lib/killmyidea come from the supplied repository. They provide the TypeSafe/Jev client, questions, scoring, clarity gate, verdicts, and assessment copy. The client has been extended to support Vercel's TypeSafe-compatible Jev API using a separate server-side AI_GATEWAY_API_KEY. The new server route uses those functions with the money goal and does not retain ideas or import upstream analytics.

The visible example is an illustrative fixture, not an API response. Hivemind is not yet connected. The generated handoff brief contains the user's idea and scores for use with Hivemind once the correct service is identified.
