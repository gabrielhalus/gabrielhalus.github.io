import { useEffect, useState } from 'react';
import '../styles/home.scss';

function Home() {
  const [localTime, setLocalTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div className='home'>
        <div className='background-gradient' />
        <div className='info'>
          <div className='container'>
            <div className='icon'>
              <div className='person'>
                <img src='images/avatar.png' alt='person' />
              </div>
            </div>
            <div className='group'>
              <h1 className='text--md--semibold light-blue--400'>Gabriel Halus</h1>
              <h2 className='text--sm--regular gray--50'>Computer Science Bachelor Student</h2>
            </div>
            <p className='text--sm--regular gray--300'>
              Passionate web developer specializing in creating exceptional web applications.
              Constantly learning and pushing boundaries to deliver high-quality, user-friendly
              experiences.
            </p>
            <div className='group'>
              <p className='text--sm--regular gray--300'>📍 Grenoble, France</p>
              <p className='text--sm--regular gray--300'>
                🕙{' '}
                {localTime?.toLocaleString(['FR'], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                (UTC +02:00)
              </p>
            </div>
            <a href='' className='button--primary text--sm--semibold white'>
              Get to know more about me
            </a>
          </div>

          <div className='container'>
            <div className='text--md--semibold light-blue--400'>Contact</div>
            <div className='group inline'>
              <img src='icons/telephone.svg' alt='telephone' className='user-select' />
              <div className='group'>
                <a href='tel:+33789038887' className='caption--regular gray--300'>
                  (+33) 7 89 03 88 87
                </a>
                <p className='caption--regular gray--500 user-select'>Phone</p>
              </div>
            </div>

            <div className='group inline'>
              <img src='icons/envelope.svg' alt='envelope' className='user-select' />
              <div className='group'>
                <a href='mailto:gabrielhalus@gmail.com' className='caption--regular gray--300'>
                  gabrielhalus@gmail.com
                </a>
                <p className='caption--regular gray--500 user-select'>Email</p>
              </div>
            </div>

            <div className='group inline'>
              <img src='icons/github.svg' alt='github' className='user-select' />
              <div className='group'>
                <a
                  target='_blank'
                  rel='noreferrer'
                  href='https://github.com/gabrielhalus'
                  className='caption--regular gray--300'>
                  github.com/gabrielhalus
                </a>
                <p className='caption--regular gray--500 user-select'>GitHub</p>
              </div>
            </div>
          </div>

          <div className='container'>
            <p className='text--md--semibold light-blue--400'>Work</p>
            <div className='group inline'>
              <img
                src='images/laboratoire-informatique-grenoble.png'
                alt='LIG'
                className='user-select'
              />
              <div className='group'>
                <p className='caption--regular gray--300'>
                  Intern Fullstack Dev at <b>LIG</b>
                </p>
                <p className='caption--regular gray--500 user-select'>April 2023 - Jun 2023</p>
              </div>
            </div>
          </div>
        </div>

        <div className='portfolio flex-1'>
          <div className='container'>
            <h2 className='text--md--semibold light-blue--400'>Work In Progress</h2>
            <div className='group'>
              <p className='text--sm--regular gray--300'>
                This website is currently undergoing significant updates and improvements to create
                a more comprehensive and captivating showcase of my journey.
              </p>
              <p className='text--sm--regular gray--500'>
                Thank you for your patience, and get ready for the grand reveal of exciting new
                developments coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='container'>
        <p className='text--sm--regular gray--300'>&copy; 2023 Made with ♥ by Gabriel Halus</p>
      </div>
    </>
  );
}

export default Home;
