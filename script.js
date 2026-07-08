document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Theme Toggle (Dark / Light Mode)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve saved theme preference, default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark-theme';
  body.className = savedTheme;

  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.className = 'light-theme';
      localStorage.setItem('portfolio-theme', 'light-theme');
    } else {
      body.className = 'dark-theme';
      localStorage.setItem('portfolio-theme', 'dark-theme');
    }
  });

  // ==========================================================================
  // 2. Mobile Menu Toggle
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    navbar.classList.toggle('menu-open');
    const icon = mobileToggle.querySelector('i');
    if (navbar.classList.contains('menu-open')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbar.classList.contains('menu-open')) {
        navbar.classList.remove('menu-open');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
      }
    });
  });

  // ==========================================================================
  // 3. Active Link Tracking on Scroll (Intersection Observer)
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // ==========================================================================
  // 4. Skills Section Tab Switching
  // ==========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTabId = button.getAttribute('data-tab');

      // Update active button state
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Update visible tab pane state
      tabPanes.forEach(pane => {
        if (pane.getAttribute('id') === targetTabId) {
          pane.classList.add('active');
          
          // Re-trigger progress bar animations when tab opens
          const progressBars = pane.querySelectorAll('.progress-bar');
          progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
              bar.style.width = width;
            }, 50);
          });
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // ==========================================================================
  // 5. Interactive SVG Neural Network Globe (Cursor Hover Effects)
  // ==========================================================================
  const aiCoreSvg = document.getElementById('ai-core');
  const nodes = document.querySelectorAll('.network-nodes .node');
  const lines = document.querySelectorAll('.network-lines line');

  if (aiCoreSvg) {
    aiCoreSvg.addEventListener('mousemove', (e) => {
      const rect = aiCoreSvg.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2; // relative to center
      const y = e.clientY - rect.top - rect.height / 2;

      nodes.forEach((node, index) => {
        if (node.classList.contains('core-node')) return; // Keep core steady
        
        const factor = (index % 3 + 1) * 0.05; // Different wiggles per node
        const dx = x * factor;
        const dy = y * factor;
        node.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      lines.forEach((line) => {
        line.style.opacity = '0.65'; // Brighten connections
      });
    });

    aiCoreSvg.addEventListener('mouseleave', () => {
      nodes.forEach(node => {
        node.style.transform = 'translate(0px, 0px)';
      });
      lines.forEach(line => {
        line.style.opacity = '0.3';
      });
    });
  }

  // ==========================================================================
  // 6. Contact Form Validation & Submission Feedback
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formStatus.className = 'form-status';
      formStatus.textContent = 'Sending message...';

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        formStatus.classList.add('error');
        formStatus.textContent = 'Please fill out all required fields.';
        return;
      }

      setTimeout(() => {
        formStatus.classList.add('success');
        formStatus.textContent = 'Thank you! Your message was sent successfully.';
        contactForm.reset();
      }, 1200);
    });
  }

  // ==========================================================================
  // 7. AI Chatbot Agent Logic
  // ==========================================================================
  const chatbot = document.getElementById('chatbot');
  const chatTrigger = document.getElementById('chat-trigger');
  const chatClose = document.getElementById('chat-close');
  const chatWindow = document.getElementById('chat-window');
  const chatBody = document.getElementById('chat-body');
  const chatInputForm = document.getElementById('chat-input-form');
  const chatInput = document.getElementById('chat-input');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  // Toggle chat widget window visibility
  chatTrigger.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
      chatInput.focus();
      scrollToBottom();
    }
  });

  chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active');
  });

  // Suggestion chips handler
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.textContent;
      handleUserMsgSubmit(text);
    });
  });

  // Form submit handler
  chatInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;
    handleUserMsgSubmit(query);
    chatInput.value = '';
  });

  function handleUserMsgSubmit(text) {
    // Add user message to stream
    appendMessage('user', text);
    scrollToBottom();

    // Show typing animation
    const typingElement = showTypingIndicator();
    scrollToBottom();

    // Generate response and render with typing delay
    setTimeout(() => {
      removeTypingIndicator(typingElement);
      const response = generateBotResponse(text);
      appendMessage('bot', response);
      scrollToBottom();
    }, 1000);
  }

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', sender === 'user' ? 'user-msg' : 'bot-msg');
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatBody.appendChild(msgDiv);
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('typing-indicator');
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(indicator);
    return indicator;
  }

  function removeTypingIndicator(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Conversational Resume Knowledge Base Engine
  function generateBotResponse(query) {
    const raw = query.toLowerCase().trim();

    // Greeting
    if (raw.match(/\b(hi|hello|hey|greetings|hola)\b/)) {
      return "Hello! How can I assist you today? You can ask me about Sarbashree's experience at <strong>Jio</strong> or <strong>Accenture</strong>, her <strong>skills</strong>, <strong>projects</strong>, <strong>education</strong>, or <strong>certifications</strong>!";
    }

    // Jio Platforms / Reliance Jio
    if (raw.includes('jio') || raw.includes('reliance')) {
      return "Sarbashree has extensive history with <strong>Jio Platforms Ltd</strong> in Gurgaon:<br><br>" +
             "1. <strong>MLOps/LLMOps/GenAI Engineer</strong> (May 2022 – Present):<br>" +
             "• Designed end-to-end MLOps pipelines on Azure for training, test, deployment.<br>" +
             "• Deployed and scaled models on Azure Kubernetes Service (AKS) with Docker.<br>" +
             "• Built RAG pipelines and LLMOps workflows integrating vector stores and Azure OpenAI.<br><br>" +
             "2. <strong>DataOps Engineer</strong> (Sep 2020 – Dec 2022):<br>" +
             "• Built data pipelines with AWS Glue for feature extraction.<br>" +
             "• Managed automated model deployments to SageMaker via Terraform/CloudFormation.<br><br>" +
             "3. <strong>DataOps</strong> (May 2015 – Sep 2020):<br>" +
             "• Built a centralized data lake using S3, Redshift Spectrum, and AWS Lake Formation.";
    }

    // Accenture
    if (raw.includes('accenture') || raw.includes('health benefit') || raw.includes('pune')) {
      return "Sarbashree worked as a <strong>DevOps Release Engineer</strong> at <strong>Accenture</strong> in Pune (Aug 2013 – Jul 2014) on the <em>Accenture Health Benefit Exchange</em> project:<br><br>" +
             "• Managed over 100+ Production releases independently as a Release Engineer.<br>" +
             "• Automated software build and sprint deployment cycles using DevOps CI/CD pipeline automation.<br>" +
             "• Created a collaborative team website using the Django Python framework.<br>" +
             "• Automated regression test suites using Selenium Webdriver and AutoIT, reducing execution times by 80%.";
    }

    // Skills & Tech Stack
    if (raw.includes('skill') || raw.includes('tech') || raw.includes('tool') || raw.includes('stack') || raw.includes('language')) {
      return "Here is a summary of Sarbashree's technical skill matrix:<br><br>" +
             "• <strong>Languages</strong>: Python, Rust, SQL, Scala, Shell Scripting.<br>" +
             "• <strong>MLOps/LLMOps</strong>: Azure ML, AWS SageMaker, MLflow, EKS/AKS (Kubernetes), Docker, Databricks, Snowflake.<br>" +
             "• <strong>GenAI Stack</strong>: AWS Bedrock, Azure OpenAI APIs, vector databases (Pinecone, Chroma, Milvus), LangChain, AgentOps, OpenLLMetry.<br>" +
             "• <strong>Data Engineering</strong>: PySpark, AWS Glue, EMR, Redshift, Step Functions, Airflow ETL DAGs.<br>" +
             "• <strong>Monitoring</strong>: CloudWatch, Azure Monitor, Application Insights, Prometheus, Grafana, Loki, Datadog.";
    }

    // GenAI / LLM / RAG / AI
    if (raw.includes('genai') || raw.includes('llm') || raw.includes('rag') || raw.includes('ai') || raw.includes('agent') || raw.includes('bedrock') || raw.includes('openai')) {
      return "Sarbashree is specialized in <strong>GenAI & LLMOps Architecture</strong>:<br><br>" +
             "• <strong>RAG & Vector Stores</strong>: Integrates vector search databases (Pinecone/Chroma) and embeds with Azure OpenAI models.<br>" +
             "• <strong>Agent Observability</strong>: Proficient in GenAI tracking structures including AgentOps, OpenLLMetry, and ADK.<br>" +
             "• <strong>IIT Kharagpur EPGP</strong>: Currently completing an Executive PG in Generative AI & Agentic AI (Class of 2026).<br>" +
             "• <strong>Enterprise Bot</strong>: Designed a GenAI customer-facing assistant utilizing Bedrock and Titan models.";
    }

    // Certifications
    if (raw.includes('certif') || raw.includes('credential') || raw.includes('license') || raw.includes('aws certified')) {
      return "Sarbashree holds several professional credentials:<br><br>" +
             "• <strong>AWS Certified Machine Learning – Specialty (MLS-C01)</strong><br>" +
             "• Certified MLOps with Databricks<br>" +
             "• GCP MLOps: Vertex AI (Coursera)<br>" +
             "• GenAI Engineer – AWS Bedrock & Titan (Coursera)<br>" +
             "• Google Certified Data Engineer<br>" +
             "• Post Graduate Program in Cloud Computing (AWS, GCP, Azure) – Great Lakes";
    }

    // Projects
    if (raw.includes('project') || raw.includes('portfolio') || raw.includes('github') || raw.includes('code')) {
      return "Some of Sarbashree's key projects include:<br><br>" +
             "1. <strong>Enterprise RAG Agent</strong>: Multi-agent retrieval pipelines querying database items, featuring AgentOps observability (AWS Bedrock & Titan).<br>" +
             "2. <strong>Automated MLOps Registry</strong>: Model lifecycle registry, drift monitoring, and AKS cluster container deployments (MLflow + Docker).<br>" +
             "3. <strong>Accenture Health Benefit Exchange</strong>: Automated build infrastructure, Django website, and automated Selenium test frameworks.";
    }

    // Education
    if (raw.includes('education') || raw.includes('study') || raw.includes('college') || raw.includes('university') || raw.includes('degree') || raw.includes('bits') || raw.includes('iit') || raw.includes('mgr')) {
      return "Sarbashree's educational qualifications include:<br><br>" +
             "• <strong>Executive Post Graduate Program (Generative AI & Agentic AI)</strong> – IIT Kharagpur (2026)<br>" +
             "• <strong>M.Tech in Data Science & Engineering</strong> – BITS Pilani (2024)<br>" +
             "• <strong>EPGP in Data Science & Big Data</strong> – Aegis School of Business (2018)<br>" +
             "• <strong>B.Tech in Electronics & Communication</strong> – Dr. M.G.R University (2011)";
    }

    // Contact
    if (raw.includes('contact') || raw.includes('email') || raw.includes('phone') || raw.includes('mail') || raw.includes('call') || raw.includes('hire') || raw.includes('reach')) {
      return "You can get in touch with Sarbashree Ray via:<br><br>" +
             "• ✉️ <strong>Email</strong>: <a href='mailto:sarbashree15@gmail.com'>sarbashree15@gmail.com</a><br>" +
             "• 📞 <strong>Phone</strong>: +91-9004485220<br>" +
             "• 📍 <strong>Location</strong>: Gurgaon, Haryana, India<br>" +
             "• 🔗 <strong>LinkedIn</strong>: <a href='https://www.linkedin.com/in/sarbashree/' target='_blank'>linkedin.com/in/sarbashree</a>";
    }

    // Churn / Stats / Achievements
    if (raw.includes('achievement') || raw.includes('impact') || raw.includes('save') || raw.includes('reduce') || raw.includes('optim')) {
      return "Key career achievements include:<br><br>" +
             "• **35% SageMaker Cost Savings** using Spot Instances and managed pipeline structures.<br>" +
             "• **40% Spark pipeline run-time optimization** on EMR and Glue jobs.<br>" +
             "• **80% DevOps task automation** for release management and testing processes.";
    }

    // Default Fallback
    return "I am not fully sure how to answer that question. You can ask me about her 'Jio platforms experience', 'Accenture role', 'technical skills', 'education', 'certifications', or 'featured projects'!";
  }
});
